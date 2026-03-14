const exec = require('child_process').exec;
const shortid = require('shortid');
const constants = require('./helpers/constants');
const executeCommands = require('./helpers/executeCommands');

const { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR, FILE_ENCRYPTED } = constants
const { encryptPdfCommand } = executeCommands;

const convertWithOptions = (uploadedFile, pwd, callback) => {
    const convertedDocFileName = `${shortid.generate()}_encrypted.pdf`;
    const enterPath = uploadedFile.path;
    const outputPath = `${DEFAULT_FOLDER_PATH}${convertedDocFileName}`;
    try { 
        const command = encryptPdfCommand(pwd, enterPath, outputPath);
        exec(command, function(error) {
            if(error !== null) {
                console.log(error);
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
 
const convert = (uploadedFile, pwd, callback) => convertWithOptions(uploadedFile, pwd, callback)

module.exports = {
    convert, 
    convertWithOptions,
}
