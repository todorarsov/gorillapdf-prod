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
router.post('/pdf-to-word', upload.single('fileToBeProcessed'), (req, res) => {
    //timeout 2 minute2
    req.setTimeout(120000);
   var pdfToWord = require('../services/pdfToWord');
   try {
       if(req.file.mimetype === "application/pdf") {
           pdfToWord.convert(req.file, callback => {
               callback.error ? res.json({ error: translateErrorMessage(res, callback.error) }) :
                   res.json({
                       downloadUrl: `${apiHost}${callback.downloadUrl}`,
                       initialSize: callback.initialSize,
                       reducedSize: callback.reducedSize,
                       percentage: callback.percentage,
                   })
           });
       }
   } catch(err) {
       console.log(err);
       res.json({ error: GENERIC_ERROR })
   }
});


module.exports=router;