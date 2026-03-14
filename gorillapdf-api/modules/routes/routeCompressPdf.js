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


router.post('/compress-pdf', upload.single('fileToBeProcessed'), (req, res) => {

    req.setTimeout(300000);
    const compressPdf = require('../services/compressPdf');
    try{
        if (req.file.mimetype === "application/pdf") {
            compressPdf.convert(req.file, req.body.compression, callback => {
                callback.error ? res.json({ error: callback.error }) :
                    res.json({
                        downloadUrl: `${apiHost}${callback.downloadUrl}`,
                        initialSize: callback.initialSize,
                        reducedSize: callback.reducedSize,
                        percentage: callback.percentage,
                    })
            });
        }
    }
    catch(err)
    {
        console.log(err)
        res.json({ error: GENERIC_ERROR })
    }
});

module.exports = router;