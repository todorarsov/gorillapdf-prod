'use strict'

var gorillaHelper = (function() {
    const FE_BASE_URL = `http://localhost:5001/`;
    const API_BASE_URL = `http://localhost:7001/`;

    const getElByClass = el => {
        let elements = document.getElementsByClassName(el);
        return elements;
    };

    const setCookie = (key, value, expiry) => {
        localStorage.setItem(key, value);
    };

    const getCookie = key => {
        return localStorage.getItem(key);
    };

    const setCookieForPage = pageId => {

        let localStorageValue = getCookie(pageId);
        if (localStorageValue === null) {
            setCookie(pageId, 0);
        }
        return localStorageValue;
    };

    const onRaterLoad = (raterId, formControlId, cookieId, cookieValue, cookieExpiryDays) => {
        const serviceId = document.querySelector('#serviceId').value;
        const showMessage = new Notyf();
        let starRatingStep = raterJs({
            starSize: 32,
            step: 0.5,
            element: document.querySelector(raterId),
            rating: parseFloat(cookieValue),
            rateCallback: function rateCallback(rating, done) {
                let existingCookieId = getCookie(cookieId);
                if (existingCookieId === "0" || existingCookieId === null) {
                    starRatingStep.setRating(parseFloat(rating));
                    document.querySelector("#ratingValue").value = rating;
                    setCookie(cookieId, rating);

                    let formdata = new FormData();
                    formdata.append("ratingValue", rating);
                    formdata.append("serviceId", serviceId);
                    const instance = axios.create({
                        baseURL: FE_BASE_URL,
                        headers: { 'Content-Type': 'multipart/form-data', 'crossDomain': true }
                    });

                    instance.post('/update-rating', formdata).then((response) => {
                        done();
                    }).catch((e) => {
                        errorHandler(e);
                    })
                } else {
                    showMessage.error(translationToJs.alreadyVoted)
                    done();
                }
            }
        });
    };

    const setContentBasedOnResponseData = (respFromServer, url) => {
        const showMessage = new Notyf()

        if (respFromServer.error === "GenericError") {
            showMessage.error(translationToJs.genericError);
            hideElById("submit-btn");
            showElById("start-over-new")
        } else
        if (respFromServer.error === "FileLarger") {
            showMessage.error(translationToJs.compressFail);
            hideElById("submit-btn");
            showElById("start-over-new")
        } else
        if (respFromServer.error === "FileLimit") {
            showMessage.error(translationToJs.maximumSize);
            hideElById("submit-btn");
            showElById("start-over-new")
        } else if (respFromServer.error === "FileEncrypted") {
            showMessage.error(translationToJs.errorEncrypted);
            hideElById("submit-btn");
            showElById("start-over-new")
        } else if (respFromServer.error === "PasswordIncorrect") {
            showMessage.error(translationToJs.passwordIncorrect);
        } else {
            if (respFromServer.uploadedFilePath) {
                document.querySelector("#fileUploadedPath").value = respFromServer.uploadedFilePath;
            }
            if (respFromServer.failed === false) {
                showDownloadSection(respFromServer);
            }
            if (respFromServer.isEncrypted && respFromServer.downloadUrl === "") {
                showDecryptSection();
                if (respFromServer.error != "Encrypted") {
                    showMessage.error(translationToJs.errorEncrypted);
                }
            }
            if (respFromServer.error && !respFromServer.isEncrypted) {
                hideDownloadSection();
                showMessage.error(translationToJs.genericError);
            }
            if (respFromServer.downloadUrl) {
                attrEquiv("#download-url", "href", respFromServer.downloadUrl);
                showDownloadSection(respFromServer);
            }
            if (respFromServer.percentage) {
                if (respFromServer.percentage !== "" && respFromServer.percentage !== null) {
                    showElById("fileCompressed");
                    document.querySelector("#initialSize").innerHTML = respFromServer.initialSize;
                    document.querySelector("#reducedSize").innerHTML = respFromServer.reducedSize;
                    document.querySelector("#percentage").innerHTML = respFromServer.percentage;
                }
            }
            if (respFromServer.info) {
                if (respFromServer.info !== "" && respFromServer.info !== null) {
                    showElById("download-section");
                    showElById("fileNotCompressed");
                    document.querySelector("#ompressInfo").innerHTML = respFromServer.info;
                    startOverBtnShowSubmitBtnHide();
                }
            }
            if (respFromServer.downloadUrl === "" && respFromServer.error === "Encrypted" && respFromServer.isEncrypted === true && url === "password-protect-pdf") {
                showMessage.error(translationToJs.passwordIncorrect);
                showElById("start-over-new")
            }
        }
    }

    const startOverBtnShowSubmitBtnHide = () => {
        hideElById("submit-btn");
        showElById("start-over");
    };

    const attrEquiv = (selector, attr, setterFunction) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.setAttribute(attr, setterFunction)
        })
    };

    const errorHandler = err => {
        var showMessage = new Notyf();
        hideElById("postDataStatus");
        document.querySelector("#status").innerHTML = `<b>${translationToJs.genericError}</b>`;
        startOverBtnShowSubmitBtnHide();
        showElById("start-over-new")
        showMessage.error(translationToJs.genericError);
    };

    const showDownloadSection = respFromServer => {
        attrEquiv("#download-url", "href", respFromServer.downloadUrl);
        document.querySelector("#fileToBeProcessed").value = null;
        showElById("download-section");
        showElById("download-url");
        startOverBtnShowSubmitBtnHide();
    };

    const hideDownloadSection = () => {
        startOverBtnShowSubmitBtnHide();
        hideElById("download-url");
        hideElById("download-section");
    };

    const showDecryptSection = () => {
        const getDecPwd = document.querySelector(".enter-decpwd");
        if (getDecPwd) {
            getDecPwd.classList.remove("el-display-none")
        }
        hideElById("download-url");
        hideElById("download-section");
        hideElById("start-over");
    };

    const hideDecryptSection = () => {
        const getDecPwd = document.querySelector(".enter-decpwd");
        if (getDecPwd)
            getDecPwd.classList.add("el-display-none");
        hideElById("convert-buttons");
    };

    const showElById = elementId => {
        const elementExistInDom = document.querySelector("#" + elementId);
        if (elementExistInDom) document.querySelector("#" + elementId).style.display = 'inline';
    };

    const hideElById = elementId => {
        const elementExistInDom = document.querySelector("#" + elementId);
        if (elementExistInDom) document.querySelector("#" + elementId).style.display = 'none';
    }

    const showElByClass = elementId => {
        let elements = getElByClass(elementId);
        if (elements) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'inline';
            }
        }
    };

    const hideElByClass = elementId => {
        let elementExistInDom = document.querySelector("#" + elementId);
        if (elementExistInDom) getElByClass(elementId).style.display = 'none';
    }

    const enableButtonById = btnId => {
        let btnExistInDom = document.querySelector("#" + btnId);
        if (btnExistInDom) document.querySelector("#" + btnId).disabled = false;
    };

    //const changeLanguage = lang => {
      //  document.cookie = 'lang=' + lang;
      //  return false;
   // };
	
	const changeLanguage = (lang, expirationDays = 180) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    const languageData = {
        lang,
        expiration: expirationDate.toUTCString()
    };

    localStorage.setItem('language', JSON.stringify(languageData));

    return false;
};

    const startOver = () => window.location.reload();

    const setCookieForService = cookieName => {
        var getCookieValue = setCookieForPage(cookieName);
        window.addEventListener("load", onRaterLoad("#rater-step", "form-rating", cookieName, getCookieValue, 365), !1);
    }

    const bookmark = a => {
        pageTitle = document.title;
        pageURL = document.location;
        try {
            // Internet Explorer solution
            eval("window.external.AddFa-vorite(pageURL, pageTitle)".replace(/-/g, ''));
        } catch (e) {
            try {
                // Mozilla Firefox solution
                window.sidebar.addPanel(pageTitle, pageURL, "");
            } catch (e) {
                // Opera solution
                if (typeof(opera) == "object") {
                    a.rel = "sidebar";
                    a.title = pageTitle;
                    a.url = pageURL;
                    return true;
                } else {
                    // The rest browsers (i.e Chrome, Safari)
                    alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
                }
            }
        }
        return false;
    };

    const makeRequestToServerSimple = url => {
        const showMessage = new Notyf();
        hideElById("download-section");
        const urlInputValue = document.querySelector("#urlToBeProcessed").value;
        const isValidUrl = validUrl(urlInputValue);
        if (isValidUrl) {
            let formdata = new FormData();
            formdata.append("urlName", urlInputValue);
            const instance = axios.create({
                baseURL: API_BASE_URL,
                headers: { 'Content-Type': 'multipart/form-data', 'crossDomain': true }
            });
            const config = {
                onUploadProgress: progressEvent => {
                    let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                    showElById("postDataStatus2");
                    showElById("progressBar2");
                    document.querySelector("#progressBar2").value = Math.round(percentCompleted);
                    document.querySelector("#status2").innerHTML = "<h6>" + Math.round(percentCompleted) + "% " + translationToJs.processingLabel + "</h6><br/>";
                }
            }
            instance.post(url, formdata, config).then((response) => {

                if (response.data === "Invalid URL Format") {
                    showMessage.error(translationToJs.urlNotRecognized);
                    hideElById("postDataStatus2");
                } else if (response.data === "URL Secured") {
                    showMessage.error(translationToJs.urlSecured);
                    showElById("start-over-simple");
                    hideElById("submit-btn-simple");
                    hideElById("postDataStatus2");

                } else {
                    hideElById("postDataStatus2");
                    hideElById("pills-profile");
                    downUrl(response.data);
                    enableButtonById("submit-btn");
                }
            }).catch((e) => {
                errorHandler(e);
            })
        } else {
            elementShowAndHideMilliseconds("invalid-url", 10000);
        }
    };

    const validUrl = str => {
        const res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
    };

    const hideDropzoneContent = () => {
        document.querySelector("#dropzone-container").classList.add("el-display-none");
        const pwdEl = document.querySelector(".enter-pwd");
        const compressionEl = document.querySelector("#compression");
        if (compressionEl) {
            compressionEl.classList.add("el-display-none")
        }
        if (pwdEl) {
            pwdEl.classList.add("el-display-none");
        }
    };

    const downUrl = response => {
        if (response.downloadUrl) {
            attrEquiv("#download-url", "href", response.downloadUrl);
            const downloadSection = document.querySelector(".download-section-simple-css");
            if (downloadSection) {
                downloadSection.classList.remove("el-display-none");
                downloadSection.classList.add("el-display-block");
                downloadSection.classList.add("el-float-left");
            }

            hideDropzoneContent();
        }
    };

    const passwordIsValidOrNotExist = (pwd, fileLength) => {
        const showMessage = new Notyf()
        let pwdValid = false;

        if (pwd && fileLength > 0) {
            var pwdValue = pwd.value;
            if (pwdValue.length >= 5 && pwdValue.length <= 24) {
                pwdValid = true;
                showMessage.success(translationToJs.passwordValid);
            } else {
                pwdValid = false;
                showMessage.error(translationToJs.passwordBetween);
            }
        } else {
            pwdValid = true;
        }
        return pwdValid;
    };

    const genericRemoveFileBehaviour = (filesLength, url) => {
        const submitBtn = document.querySelector("#submit-btn");
        const pwdEl = document.querySelector(".enter-pwd");
        const compressEl = document.querySelector(".enter-compression-type");
        if (compressEl) {
            compressEl.classList.add("el-display-none");
        }
        if (pwdEl) {
            pwdEl.classList.add("el-display-none");
        }
        if (filesLength > 0) {
            submitBtn.classList.remove("el-display-none");
        } else {
            if (translationToJs.serviceName === "unlock-pdf") {
                const getDecPwd = document.querySelector(".enter-decpwd");
                if (getDecPwd)
                    getDecPwd.classList.add("el-display-none");
            }
            submitBtn.classList.add("el-display-none");
        }
    }

    const genericAddFileBehaviour = (filesLength) => {
        const showMessage = new Notyf();
        const pwdEl = document.querySelector(".enter-pwd");
        const submitBtn = document.querySelector("#submit-btn");

        const compressEl = document.querySelector(".enter-compression-type");
        if (compressEl) {
            compressEl.classList.remove("el-display-none");
        }
        if (pwdEl) {
            pwdEl.classList.remove("el-display-none");
        }
        if (filesLength > 0) {
            submitBtn.classList.remove("el-display-none");
        } else {
            submitBtn.classList.add("el-display-none");
        }

        showMessage.success(translationToJs.fileAdded);
    };

    const axiosConfig = processingLabel => {
        const config = {
            onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.floor(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                showElById("postDataStatus");
                showElById("progressBar");
                document.querySelector("#progressBar").value = Math.round(percentCompleted);
                document.querySelector("#status").innerHTML =
                    "<h6>" + Math.round(percentCompleted) + "% " + processingLabel + "</h6><br/>";
            },
        };
        return config
    };

    const configurationObject = (allowed = "application/pdf", max = 1, maxSize = '50MB') => {
        const confObject = {
            allowedExtension: allowed,
            maxFiles: max,
            maxFileSize: maxSize
        }
        return confObject;
    };

    let configurationByUrl = function(url) {
        const configurationByService = configurationPerService(url);
        const dropzoneConfiguration = {
            allowMultiple: true,
            allowReorder: true,
            allowImageResize: true,
            allowImagePreview: true,
            allowFileTypeValidation: true,
            allowFileSizeValidation: true,
            dropValidation: false,
            imagePreviewHeight: 200,
            pdfPreviewHeight: 180,
            pdfPreviewWidth: 100,
            acceptedFileTypes: configurationByService.allowedExtension,
            labelFileTypeNotAllowed: "Invalid type",
            maxFileSize: configurationByService.maxFileSize,
            maxFiles: configurationByService.maxFiles,
            credits: false,
            imageCropAspectRatio: 1,
            imageResizeTargetWidth: 256,
            imageResizeMode: 'contain',
            labelIdle: translationToJs.labelIdle
        }
        return dropzoneConfiguration;
    };

    let configurationPerService = function(serviceInfo) {
        let confObject = configurationObject();
        switch (serviceInfo) {
            case "compress-pdf":
            case "pdf-to-text":
            case "password-protect-pdf":
            case "unlock-pdf":
            case "pdf-to-word":
                break;
            case "txt-to-pdf":
                confObject = configurationObject("text/plain");
                break;
            case "html-to-pdf":
                confObject = configurationObject("text/html");
                break;
            case "jpg-to-pdf":
                confObject = configurationObject("image/jpeg,image/jpg", 10, "10MB");
                break;
            case "online-ocr":
                confObject = configurationObject("image/jpeg,image/jpg,image/png", 1, "50MB");
                break;
            case "png-to-pdf":
                confObject = configurationObject("image/png", 10, "10MB");
                break;
            case "odt-to-pdf":
            case "word-to-pdf":
                confObject = configurationObject(wordTypes());
                break;
            case "ods-to-pdf":
            case "excel-to-pdf":
                confObject = configurationObject(excelTypes());
                break;
            case "ppt-to-pdf":
            case "odp-to-pdf":
                confObject = configurationObject(pptTypes());
                break;
            case "merge-pdf":
                confObject = configurationObject("application/pdf", 10, "10MB");
                break;

            default:
        }
        return confObject;
    };

    let submitData = function() {
        const files = pond.getFiles();
        const params = new FormData();
        let additionalValidation = true;
        if (translationToJs.serviceName === "merge-pdf" && files.length <= 1) {
            displayMessage.error(translationToJs.minimumFiles);
        } else
        if (files.length === 0) {
            displayMessage.error(translationToJs.noFileSelected)
        } else {
            const pwdInput = document.querySelector("#pwd");
            const decPwdInput = document.querySelector("#decpwd");

            for (var i in files) {
                params.append("fileToBeProcessed", files[i].file);
                if (translationToJs.serviceName === "compress-pdf") {
                    const compressionType = document.querySelector("#compression")
                    if (compressionType) {
                        params.append("compression", compressionType.value);
                    }
                }
                if (translationToJs.serviceName === "password-protect-pdf") {
                    additionalValidation = passwordIsValidOrNotExist(pwdInput, files.length);
                    if (pwdInput && additionalValidation) {
                        params.append(pwdInput.id, pwdInput.value);
                    }
                }
                if (translationToJs.serviceName === "unlock-pdf") {
                    if (decPwdInput) {
                        const filePath = document.querySelector("#fileUploadedPath")
                        if (decPwdInput.value !== "")
                            params.append(decPwdInput.id, decPwdInput.value);

                        if (filePath) {
                            if (filePath.value !== "")
                                params.append("fileUploadedPath", filePath.value);
                        }
                    }
                }
            }

            const instance = axios.create({
                baseURL: API_BASE_URL,
                headers: { "Content-Type": "multipart/form-data", crossDomain: true },
            });


            if (files.length >= 1 && additionalValidation) {
                instance.post(translationToJs.serviceName, params, axiosConfig(translationToJs.processingLabel))
                    .then((response) => {
                        if (translationToJs.serviceName === "unlock-pdf" && response.data.downloadUrl !== "") {

                            hideDecryptSection();
                        }
                        setContentBasedOnResponseData(response.data, translationToJs.serviceName);
                        hideElById("postDataStatus");
                        downUrl(response.data);
                    })
                    .catch((e) => {
                        errorHandler(e);
                    });
            }
        }
    };

    const filePondSetup = () => {
        const inputElement = document.querySelector('input[type="file"]');
        FilePond.registerPlugin(
            FilePondPluginImagePreview,
            FilePondPluginFileValidateType,
            FilePondPluginFileValidateSize,
            FilePondPluginPdfPreview
        );
        const pond = FilePond.create(inputElement, configurationByService);
        window.pond = pond;
    };

    const wordTypes = () => `application/msword,
    application/vnd.oasis.opendocument.text,
    application/vnd.ms-word.document.macroEnabled.12,
    application/vnd.openxmlformats-officedocument.wordprocessingml.template,
    application/vnd.openxmlformats-officedocument.wordprocessingml.document`;

    const excelTypes = () => `application/vnd.ms-excel,
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
    pplication/vnd.ms-excel.sheet.binary.macroEnabled.12,
    application/vnd.oasis.opendocument.spreadsheet`;

    const pptTypes = () => `application/vnd.ms-powerpoint,
    application/vnd.openxmlformats-officedocument.presentationml.presentation,
    application/vnd.openxmlformats-officedocument.presentationml.template,
    application/vnd.openxmlformats-officedocument.presentationml.slideshow,
    application/vnd.oasis.opendocument.presentation`;


    const OnGetURL = () => openInNewTab(document.getElementById("openurl").value);

    const openInNewTab = (url) => {
        var win = window.open(url, '_blank');
        win.focus();
    };

// Modified functions using local storage
const setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
};

const getLocalStorage = key => {
    return localStorage.getItem(key);
};

const setLocalStorageForPage = pageId => {
    let localStorageValue = getLocalStorage(pageId);
    if (localStorageValue === null) {
        setLocalStorage(pageId, 0);
    }
    return localStorageValue;
};

    return {
        setCookieForPage: setCookieForPage,
        onRaterLoad: onRaterLoad,
        changeLanguage: changeLanguage,
        startOver: startOver,
        getCookie: getCookie,
        hideElByClass: hideElByClass,
        hideElById: hideElById,
        showElByClass: showElByClass,
        showElById: showElById,
        setCookieForService: setCookieForService,
        bookmark: bookmark,
        attrEquiv: attrEquiv,
        showDownloadSection: showDownloadSection,
        showElById: showElById,
        validUrl: validUrl,
        errorHandler: errorHandler,
        setContentBasedOnResponseData: setContentBasedOnResponseData,
        downUrl: downUrl,
        hideDropzoneContent: hideDropzoneContent,
        passwordIsValidOrNotExist: passwordIsValidOrNotExist,
        genericRemoveFileBehaviour: genericRemoveFileBehaviour,
        genericAddFileBehaviour: genericAddFileBehaviour,
        makeRequestToServerSimple: makeRequestToServerSimple,
        axiosConfig: axiosConfig,
        configurationObject: configurationObject,
        configurationPerService: configurationPerService,
        configurationByUrl: configurationByUrl,
        submitData: submitData,
        filePondSetup: filePondSetup,
        OnGetURL: OnGetURL,
        setLocalStorage: setLocalStorage,
        getLocalStorage: getLocalStorage,
        setLocalStorageForPage: setLocalStorageForPage,
        API_BASE_URL: API_BASE_URL,
        FE_BASE_URL,
    };
}(gorillaHelper || {}));