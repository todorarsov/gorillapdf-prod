const fs = require('fs');
const PDFDocument = require('pdfkit');
const shortid = require('shortid');
const constants = require('./helpers/constants');
const utils = require('./helpers/utils');

const convertWithOptions = (uploadedFile, callback) => {

    const { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, ENCODING_UTF_8, GENERIC_ERROR, TXT_TO_PDF_FILENAME } = constants
    try {
        let encoding = ENCODING_UTF_8;
        let extractedText = ""
        fs.readFile(uploadedFile.path, encoding, function (err, data) {
            if (err) {
                return console.error(err);
            }
            extractedText = data;

            const doc = new PDFDocument;
            const convertedDocFileName = `${shortid.generate()}_txtToPdf.pdf`;
            doc.pipe(fs.createWriteStream(`${DEFAULT_FOLDER_PATH}${convertedDocFileName}`));
            doc.font('fonts/mplus-1c-light.ttf');
            doc.fontSize(12);
            doc.text(extractedText);
            doc.save();
            doc.end();

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
