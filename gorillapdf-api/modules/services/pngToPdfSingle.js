const PDFDocument = require('pdfkit');
const shortid = require('shortid');
const fs = require('fs');
const utils = require('./helpers/utils');
const constants = require('./helpers/constants');

const convertWithOptions = (uploadedFile, callback) => {
    
    const { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR, PNG_TO_PDF_FILENAME } = constants
    try { 
        const doc = new PDFDocument;
        const convertedDocFileName = `${shortid.generate()}${PNG_TO_PDF_FILENAME}`;
        doc.pipe(fs.createWriteStream(DEFAULT_FOLDER_PATH + convertedDocFileName));
        doc.image(uploadedFile.path, 15, 15, { width: 580, height:800 });
        doc.end();
        return callback({downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName});
    }
    catch(err)
    {
        console.log(err.message)
        return callback({ error: GENERIC_ERROR })
    }
}
 
const convert = (uploadedFile, callback) => convertWithOptions(uploadedFile, callback)

module.exports = {
    convert, 
    convertWithOptions,
}
