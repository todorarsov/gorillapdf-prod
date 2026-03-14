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

router.post('/odt-to-pdf', upload.single('fileToBeProcessed'), (req, res) => {

    const officeToPdf = require('../services/officeToPdf');
        //timeout 2 minute
        req.setTimeout(120000);
    try {
        if(req.file.mimetype === "application/msword" || 
        req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        || req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.template" 
        || req.file.mimetype === "application/vnd.ms-word.document.macroEnabled.12" 
        || req.file.mimetype === "application/vnd.ms-word.template.macroEnabled.12"
        || req.file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.template" 
        || req.file.mimetype === "application/vnd.oasis.opendocument.text" 
        || req.file.mimetype==="application/octet-stream") {
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