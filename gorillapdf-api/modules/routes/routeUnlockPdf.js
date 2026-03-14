const { port, apiHost, env} = require('../../config')

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GENERIC_ERROR } = require('../services/helpers/constants');

const upload = multer({
    dest: 'public/uploads/',
    limits: {
        fileSize: 50 * 1024 * 1024 //50MB
    },
});

router.post('/unlock-pdf', upload.single('fileToBeProcessed'), (req, res) => {
     //timeout 10 seconds
     req.setTimeout(10000);
    try {
        var pwd = req.body.decpwd;
        var existingUploadPath = req.body.fileUploadedPath;
        const checkPdfEncryption = require('../services/checkPdfEnc');
        const decryptPdf = require('../services/decryptPdf');
        if(pwd) {
            decryptPdf.convert(existingUploadPath, pwd, callback => {
                res.json(
                    { downloadUrl: callback.error ==="PasswordIncorrect" ? "" :`${apiHost}${callback.downloadUrl}`,
                      uploadedFilePath: callback.uploadedFilePath,
                      isEncrypted: callback.isEncrypted,
                      error: callback.error
                 })
            });
        } else {
            checkPdfEncryption.checkStatus(req.file.destination + req.file.filename, pwd, callback => {
                res.json(
                    { downloadUrl: callback.error==="Encrypted" ? "" : `${apiHost}${callback.downloadUrl}`,
                      uploadedFilePath: callback.uploadedFilePath,
                      isEncrypted: callback.isEncrypted,
                      error: callback.error
                 })
            });
        }
    } catch(error) {
        console.log(error);
        res.json({ error: GENERIC_ERROR })
    }
});

module.exports=router;