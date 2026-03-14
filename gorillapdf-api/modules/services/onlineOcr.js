const PdfPrinter = require('pdfmake');
const tesseract = require("node-tesseract-ocr")
const shortid = require('shortid');
const fs = require('fs');
const utils = require('./helpers/utils');
const constants = require('./helpers/constants');

const convertWithOptions = (uploadedFile, callback) => {
    const { DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR } = constants
    try{
        const convertedDocFileName = `${shortid.generate()}_ocrFile.pdf`;
        let extractedText = "";
        tesseract.recognize(uploadedFile.path, utils.txtDefaultConfig()).then(text => {
            extractedText = text;
            let pdfMakeUnicode = require('pdfmake-unicode');
            let printer = new PdfPrinter(utils.getDefaultFonts());
            PdfPrinter.vfs = pdfMakeUnicode.pdfMake.vfs;
            let docDefinition = {
                content: [extractedText]
            };
            let pdfDoc = printer.createPdfKitDocument(docDefinition, {});
            pdfDoc.pipe(fs.createWriteStream(uploadedFile.destination + convertedDocFileName));
            pdfDoc.end();
            return callback({downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName})
        }).catch(error => {
            console.log(error);
            return callback( {error: GENERIC_ERROR} );
        })
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

