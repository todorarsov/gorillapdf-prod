const libre = require('../services/libreOfficeWrapper');
const shortid = require('shortid');
const fs = require('fs');
const constants = require('./helpers/constants');
const utils = require('./helpers/utils');

const convertWithOptions = (uploadedFile, callback) => {
   const  { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR } = constants;
    try {
        const convertedDocFileName = `${shortid.generate()}_convertedFile.pdf`;
        let outputPath = `${DEFAULT_FOLDER_PATH}${convertedDocFileName}`;
        libre.convert(fs.readFileSync(uploadedFile.path), "pdf", undefined, (err, done) => {
            if (err) {
                console.log(`Error converting file: ${err}`);
                return callback({ error: GENERIC_ERROR });
            }
            fs.writeFileSync(outputPath, done);
            return callback({ downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName })
        });
    }
    catch (err) {
        console.log(err.message)
        return callback({ error: GENERIC_ERROR })
    }

}

const convert = (uploadedFile, callback) => convertWithOptions(uploadedFile, callback)

module.exports = {
    convert,
    convertWithOptions
}
