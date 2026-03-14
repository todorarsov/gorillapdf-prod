const { port, apiHost, env} = require('../../config')

const express = require('express');
const router = express.Router();
const multer = require('multer');
const officeToPdf=require('../services/officeToPdf');
const constants = require('../services/helpers/constants')
const { GENERIC_ERROR } = constants

const upload = multer({
    dest: 'public/uploads/',
    limits: {
        fileSize: 50 * 1024 * 1024 //50MB
    },
});

router.post('/ods-to-pdf', upload.single('fileToBeProcessed'), (req, res) => {
    //timeout 2 minute
      req.setTimeout(120000);
    try {
        if(req.file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
        req.file.mimetype === "application/vnd.ms-excel" || 
        req.file.mimetype === "application/vnd.ms-excel.sheet.binary.macroEnabled.12" || req.file.mimetype === "application/vnd.oasis.opendocument.spreadsheet" 
        || req.file.mimeType==="application/octet-stream") {
            officeToPdf.convert(req.file, callback => {
                callback.error ? res.json({ error: callback.error }) : 
                res.json({ downloadUrl: `${apiHost}${callback.downloadUrl}` })
            });
        }
    } catch(err) {
        console.log(err);
        res.json({ error: GENERIC_ERROR })
    }
});

module.exports=router;