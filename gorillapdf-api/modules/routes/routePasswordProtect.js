const { port, apiHost, env} = require('../../config')

const express = require('express');
const router = express.Router();
const multer = require('multer');
const constants = require('../services/helpers/constants')
const { GENERIC_ERROR } = constants

const upload = multer({
    dest: 'public/uploads/',
    limits: {
        fileSize: 50 * 1024 * 1024 //50MB
    },
});


router.post('/password-protect-pdf', upload.single('fileToBeProcessed'), (req, res) => {
    const encryptPdf = require('../services/encryptPdf');
    req.setTimeout(60000);
    try{
        if(req.file.mimetype === "application/pdf") {
            encryptPdf.convert(req.file, req.body.pwd, callback => {
            callback.error ? res.json({ error: callback.error }) : 
            res.json({ downloadUrl: `${apiHost}${callback.downloadUrl}` })
        });
      }
    }
     catch(err) {
         console.log(err);
         res.json({ error: GENERIC_ERROR })
    }
});

module.exports = router;