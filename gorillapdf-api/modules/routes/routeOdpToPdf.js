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

router.post('/odp-to-pdf', upload.single('fileToBeProcessed'), (req, res) => 
{
    const officeToPdf = require('../services/officeToPdf');
    req.setTimeout(120000);
    try{
        if(req.file.mimetype === "application/vnd.ms-powerpoint" || req.file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation" 
        || req.file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.template" || req.file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.slideshow" 
        || req.file.mimetype === "application/vnd.oasis.opendocument.presentation" || req.file.mimeType==="application/octet-stream") {
        officeToPdf.convert(req.file, callback => {
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

module.exports=router;