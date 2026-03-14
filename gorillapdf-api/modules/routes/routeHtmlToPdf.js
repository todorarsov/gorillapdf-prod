const { port, apiHost, env} = require('../../config')

const express = require('express');
const myApp = express();
const router = express.Router();
const multer = require('multer');
const rateLimit = require("express-rate-limit");
const constants = require('../services/helpers/constants')
const { GENERIC_ERROR } = constants

const upload = multer({
    dest: 'public/uploads/',
    limits: {
        fileSize: 50 * 1024 * 1024 //50MB
    },
});

myApp.set('trust proxy', 1); 
  const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 3, // start blocking after 3 requests
    handler: function (req, res, /*next*/) {
        res.send('Invalid URL Format');
       // return res.status(429).send( res.json({ error: 'Too many requests. Try again later' }))
    }
  });


router.post('/html-to-pdf', createAccountLimiter, upload.array('fileToBeProcessed', 100), (req, res) => {
    req.setTimeout(120000);
    const htmlToPdf = require('../services/htmlToPdf');
    try {
        if(req.files.length > 0) {
            htmlToPdf.convert(req.files[0], callback => {
                callback.error ? res.json({ error: callback.error }) : 
                res.json({ downloadUrl: `${apiHost}${callback.downloadUrl}` })
            });
        } else {
            const urlName = req.body.urlName;
            htmlToPdf.convert(urlName, callback => {
                callback.downloadUrl ? res.json({ downloadUrl: `${apiHost}${callback.downloadUrl}` }) :
                res.json({ error: callback.error })
                
            });
        }

    } catch(error) {
        res.send('Too many requests. Try again later');
        res.json({ error: GENERIC_ERROR })
    }
});



module.exports=router;