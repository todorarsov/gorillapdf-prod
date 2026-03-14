const { port, apiHost, env} = require('../../config')

const express = require('express');
const router = express.Router();
const multer = require('multer');
const constants = require('../services/helpers/constants')
const { GENERIC_ERROR } = constants
const merge = require('../services/mergePdf');
const upload = multer({
    dest: 'public/uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 //10MB
    },
});

router.post('/merge-pdf', upload.array('fileToBeProcessed', 10), (req, res) => {
        //timeout 2 minute
    req.setTimeout(120000);
    try {
        if(req.files.length > 0 && req.files.length<=10) {
            merge.convert(req.files, callback => {
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