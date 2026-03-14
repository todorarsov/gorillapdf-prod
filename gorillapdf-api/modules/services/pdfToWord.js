const exec = require('child_process').exec;
const process = require('process');
const shortid = require('shortid');
const constants = require('./helpers/constants');
const executeCommands = require('./helpers/executeCommands');

const { GENERIC_ERROR, FILE_ENCRYPTED, DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH } = constants
const { pdfToDocxCommand } = executeCommands;

const convertWithOptions = (uploadedFile, callback) => {
    const convertedDocFileName = `${shortid.generate()}_pdfToWord.docx`;
    let filePath =  process.cwd()+'\\' + uploadedFile.path;
    let outputPath = DEFAULT_FOLDER_PATH + convertedDocFileName;
    try { 

        const command = pdfToDocxCommand(filePath, outputPath);
        exec(command, function(error) {
            if(error !== null) {
                return callback({ error: FILE_ENCRYPTED });  
            } else {
                return callback({downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName});
            }
        });
    }
    catch(err)
    {
        return callback({ error: GENERIC_ERROR });
    }
}
 
const convert = (uploadedFile, callback) => convertWithOptions(uploadedFile, callback)

module.exports = {
    convert, 
    convertWithOptions,
}


