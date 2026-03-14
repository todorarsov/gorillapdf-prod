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

// POST METHODS
router.post('/txt-to-pdf', upload.single('fileToBeProcessed'), (req, res) => {
    //timeout 2 minutes
    req.setTimeout(120000);
    const txtToPdf = require('../services/txtToPdf');
    try {
        if(req.file.mimetype === "text/plain") {
            txtToPdf.convert(req.file, callback => {
                //Should we return the real error to user???!?!?!?!
                callback.error ? res.json({ error: callback.error }) : 
                res.send({ downloadUrl: `${apiHost}${callback.downloadUrl}` })
            });
        }
    } catch(error) {
        console.log(error);
        res.json({ error: GENERIC_ERROR })
    }
});

module.exports=router;