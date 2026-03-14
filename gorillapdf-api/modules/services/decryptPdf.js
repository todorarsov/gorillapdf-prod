const exec = require('child_process').exec;
const shortid = require('shortid');
const constants = require('./helpers/constants');
const executeCommands = require('./helpers/executeCommands');

const { DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR, FILE_ENCRYPTED, PASSWORD_INCORRECT } = constants
const { decryptPdfCommand } = executeCommands;

const convertWithOptions = (uploadedFile, pwd, callback) => {
    const convertedDocFileName = `${shortid.generate()}_decrypted.pdf`;
    const enterPath = uploadedFile;
    const outputPath = `${DEFAULT_FOLDER_PATH}${convertedDocFileName}`;
    try { 
        const command = decryptPdfCommand(pwd, enterPath, outputPath);
            exec(command, function(error, stdout) {
                if(error !== null) {
                    return callback(setDefaultResponseMessage(uploadedFile,true, "", PASSWORD_INCORRECT))
                } else {
                    return callback(setDefaultResponseMessage(uploadedFile,true, DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName, ""))
                }
            });
    }
    catch(err)
    {
        return callback({ error: GENERIC_ERROR });
    }
}
 
const convert = (uploadedFile, pwd, callback) => convertWithOptions(uploadedFile, pwd, callback)

 const setDefaultResponseMessage = (uploadedFile, isEncrypted, downloadUrl, error ) => {
    return  {
        uploadedFilePath: uploadedFile,
        isEncrypted: isEncrypted,
        downloadUrl: downloadUrl,
        error: error
    };
 }
module.exports = {
    convert, 
    convertWithOptions,
}
