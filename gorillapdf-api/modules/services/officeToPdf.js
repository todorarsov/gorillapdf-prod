const libre = require('../services/libreOfficeWrapper');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');
const constants = require('./helpers/constants');

const convertWithOptions = (uploadedFile, callback) => {
   const  { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR } = constants;
    try {
        const convertedDocFileName = `${shortid.generate()}_convertedFile.pdf`;
        const outputPath = path.join(DEFAULT_FOLDER_PATH, convertedDocFileName);
        const inputBuffer = fs.readFileSync(uploadedFile.path);

        fs.mkdirSync(DEFAULT_FOLDER_PATH, { recursive: true });

        console.log('[office-to-pdf] starting conversion', {
            originalName: uploadedFile.originalname,
            storedPath: uploadedFile.path,
            mimetype: uploadedFile.mimetype,
            size: uploadedFile.size,
            outputPath
        });

        libre.convertWithOptions(inputBuffer, "pdf", undefined, {
            sourceName: uploadedFile.originalname,
            asyncOptions: { times: 20, interval: 250 },
            execOptions: { timeout: 120000 }
        }, (err, done) => {
            if (err) {
                console.log('[office-to-pdf] conversion failed', {
                    originalName: uploadedFile.originalname,
                    mimetype: uploadedFile.mimetype,
                    message: err.message
                });
                return callback({ error: GENERIC_ERROR });
            }

            fs.writeFileSync(outputPath, done);
            console.log('[office-to-pdf] conversion complete', {
                originalName: uploadedFile.originalname,
                outputPath,
                outputBytes: done.length
            });
            return callback({ downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName });
        });
    }
    catch (err) {
        console.log('[office-to-pdf] unexpected failure', err.message);
        return callback({ error: GENERIC_ERROR });
    }

}

const convert = (uploadedFile, callback) => convertWithOptions(uploadedFile, callback)

module.exports = {
    convert,
    convertWithOptions
}
