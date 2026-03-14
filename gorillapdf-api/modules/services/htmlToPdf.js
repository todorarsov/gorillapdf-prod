const shortid = require('shortid');
const constants = require('./helpers/constants');
const fs = require('fs');
const urlExists = require("url-exists");



const convert = (uploadedFile, callback) => {
   const html_to_pdf = require('html-pdf-node');
   
   const  { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR } = constants;
    try {
        const options = { format: 'A4' };

        if (typeof uploadedFile !== 'string')
        {
            const convertedDocFileName = `${shortid.generate()}_convertedHtml.pdf`;
            const textFromFile =  fs.readFileSync(uploadedFile.path, 'utf8')
            let fileContent = { content: textFromFile };
            html_to_pdf.generatePdf(fileContent, options).then(pdfBuffer => {
                fs.writeFile(DEFAULT_FOLDER_PATH + convertedDocFileName, pdfBuffer,  "binary", function(err) {
                     console.log(err)
                     if(err)
                     return callback({ error: GENERIC_ERROR });
                     else  
                     return callback({downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName })
                 });
               
              });  
        }
        else {
             urlExists(uploadedFile, function(err, exists) {
                const convertedDocFileName = `${shortid.generate()}_convertedHtml.pdf`;
                if (exists) {
                    let fileContent = { url: uploadedFile };
                    html_to_pdf.generatePdf(fileContent, options).then(pdfBuffer => {
                        fs.writeFile(DEFAULT_FOLDER_PATH + convertedDocFileName, pdfBuffer,  "binary",function(err) {
                            console.log(err);
                            if(err)
                            return callback({ error: GENERIC_ERROR });
                            else
                            return callback({downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName })
                         });
                       
                      }).catch(function(reason)
                      {
                        console.log(reason);
                        return callback("URL Secured");
                      })
                } else {
                    return callback("Invalid URL Format");
                }
              });
           
        }
    }
    catch (err) {
        console.log(err.message)
        return callback({ error: GENERIC_ERROR })
    }
}

module.exports = {
    convert
}

