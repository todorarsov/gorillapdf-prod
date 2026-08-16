const fs = require('fs');
const shortid = require('shortid');
const detect = require('charset-detector');
const PdfPrinter = require('pdfmake');
const pdfMakeUnicode = require('pdfmake-unicode');
const constants = require('./helpers/constants');
const utils = require('./helpers/utils');

const convertWithOptions = (uploadedFile, callback) => {
    const { getDefaultFonts } = utils;
    const { DEFAULT_SHORT_FOLDER_PATH, ENCODING_UTF_8, ENCODING_UTF_16_LE,  GENERIC_ERROR, TXT_TO_PDF_FILENAME } = constants
    try {
        let encoding = ENCODING_UTF_8;
        const dataBuffer = fs.readFileSync(uploadedFile.path);
        const convertedDocFileName = `${shortid.generate()}${TXT_TO_PDF_FILENAME}`;
        let matches = detect(dataBuffer);
        if (matches[0].charsetName === ENCODING_UTF_16_LE) {
            encoding = ENCODING_UTF_16_LE;
        }
        let extractedText = fs.readFileSync(uploadedFile.path, encoding);
        const printer = new PdfPrinter(getDefaultFonts());
        PdfPrinter.vfs = pdfMakeUnicode.pdfMake.vfs;
        let docDefinition = {
            content: [extractedText]
        };
        let pdfDoc = printer.createPdfKitDocument(docDefinition, {});
        pdfDoc.pipe(fs.createWriteStream(uploadedFile.destination + convertedDocFileName));
        pdfDoc.end();
        return callback({ downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName })
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
