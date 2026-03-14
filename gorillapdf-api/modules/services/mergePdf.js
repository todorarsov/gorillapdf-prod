const merge = require('easy-pdf-merge');
const path = 'public//uploads//';
const shortid = require('shortid');
const constants = require('../services/helpers/constants')

const convertWithOptions = (uploadedFiles, callback) => {
    const { DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR } = constants
    try {
        const uploadedFileArrayWithPath =  new Array();
        uploadedFiles.forEach(element => {
            uploadedFileArrayWithPath.push(element.path)
        });
        const convertedDocFileName = `${shortid.generate()}_merged.pdf`;
        merge(uploadedFileArrayWithPath, path + convertedDocFileName, function(err) {
            if(err) {
                return callback( {error: GENERIC_ERROR} );
            }
             return callback({downloadUrl: DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName})
        });
    }
    catch (err) {
        console.log(err.message)
        return callback({ error: GENERIC_ERROR })
    }
}

const convert = (uploadedFileArray, callback) => convertWithOptions(uploadedFileArray, callback)

module.exports = {
    convert, 
    convertWithOptions
}

