 
 
 const exec = require('child_process').exec;
 const fs = require('fs');
 const shortid = require('shortid');
 const constants = require('./helpers/constants');
 const executeCommands = require('./helpers/executeCommands');
 
 const { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR, FILE_ENCRYPTED } = constants
 const { encryptPdfCommand } = executeCommands;
 
 const checkStatus = (uploadedFile, pwd, callback) => {
    const ENCRYPTED_PDF_NO_PASS = "invalid password"
     const convertedDocFileName = `${shortid.generate()}_encrypted.pdf`;
     const enterPath = uploadedFile.path;
     const outputPath = `${DEFAULT_FOLDER_PATH}${convertedDocFileName}`;
     const path = DEFAULT_FOLDER_PATH;

     let command = 'qpdf --show-encryption ' + uploadedFile;
     try { 
         let isEncrypted = false;
         exec(command, function(error, stdout) {
            console.log("stdoutceer:" + stdout);
            if(stdout === ENCRYPTED_PDF_NO_PASS) {
                responseMessage.isEncrypted = true;
                return callback(setDefaultResponseMessage(uploadedFile, true,"",""))
            }
            error != null ? isEncrypted = true : isEncrypted= false;

            if(isEncrypted === false) {
                var decryptedFileName = shortid.generate();
                decryptedFileName += '_decrypted.pdf';
                fs.rename(uploadedFile, path + decryptedFileName, function(err) {
                    if(err) console.log('ERROR: ' + err);
                });
                return callback(setDefaultResponseMessage(uploadedFile, false, '/uploads/' + decryptedFileName,""))
            } else {
                const errorMessage = "Encrypted"
                return callback(setDefaultResponseMessage(uploadedFile, true, "", errorMessage))
            }
        });
     }
     catch(err)
     {
         console.log(err.message);
         return callback({ error: GENERIC_ERROR });
     }
 }
 const setDefaultResponseMessage = (uploadedFile, isEncrypted, downloadUrl, error ) => {
    return  {
        uploadedFilePath: uploadedFile,
        isEncrypted: isEncrypted,
        downloadUrl: downloadUrl,
        error: error
    };
 }

 module.exports = {
     checkStatus, 
 }

 
