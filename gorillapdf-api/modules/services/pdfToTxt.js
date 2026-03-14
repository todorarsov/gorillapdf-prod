const fs = require('fs');
const pdfReader = require('pdf-parse');
const shortid = require('shortid');
const utils = require('./helpers/utils');
const constants = require('./helpers/constants');

const convertWithOptions = (uploadedFile, callback) => {
    const { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR } = constants;
    try {
        const dataBuffer = fs.readFileSync(uploadedFile.path);
        const convertedDocFileName = `${shortid.generate()}_convertedTxt.pdf`;
        const outputPath = `${DEFAULT_FOLDER_PATH}${convertedDocFileName}`

        pdfReader(dataBuffer).then(function(data) {
            if(data)
            {
                let fonts = utils.getDefaultFonts();
                let PdfPrinter = require('pdfmake');
                let pdfMakeUnicode = require('pdfmake-unicode');
                let printer = new PdfPrinter(fonts);
                PdfPrinter.vfs = pdfMakeUnicode.pdfMake.vfs;
                let docDefinition = {
                    content: [data.text]
                };
                let options = {}
                let pdfDoc = printer.createPdfKitDocument(docDefinition, options);
                pdfDoc.pipe(fs.createWriteStream(outputPath));
                pdfDoc.end();
                return callback({downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName})
            }
            else
            {
                return callback( {error: GENERIC_ERROR} );
            }
        }).catch(function (err){
            console.log(err.message)
            return callback({ error: "FileEncrypted" })
        });
    }
    catch (err) {
        console.log(err.message)
        return callback({ error: "GenericError" })
    }
}

const convert = (uploadedFile, callback) => convertWithOptions(uploadedFile, callback)

module.exports = {
    convert, 
    convertWithOptions
}


