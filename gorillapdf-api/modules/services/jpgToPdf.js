const PDFDocument = require('pdfkit');
const shortid = require('shortid');
const fs = require('fs');
const constants = require('./helpers/constants')

const convertWithOptions = (uploadedFiles, callback) => {
    const { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR } = constants
    const uploadedFileArrayWithPath = new Array();
    uploadedFiles.forEach(element => {
        uploadedFileArrayWithPath.push(element.path)
    });
    try {
        const doc = new PDFDocument;
        const convertedDocFileName = `${shortid.generate()}_outputJpgToPdf.pdf`;
        doc.pipe(fs.createWriteStream(`${DEFAULT_FOLDER_PATH}${convertedDocFileName}`));
        uploadedFileArrayWithPath.forEach(function(element, idx, array) {
			doc.image(element, 15, 15, {width: 570})
            if (idx === array.length - 1) {} else doc.addPage();
        });
        doc.save();
        doc.end();
        return callback({ downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName });
    } catch (err) {
        return callback({ error: GENERIC_ERROR });
    }
}

const convert = (uploadedFileArray, callback) => convertWithOptions(uploadedFileArray, callback)

module.exports = {
    convert,
    convertWithOptions,
}