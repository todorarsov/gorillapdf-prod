const shortid = require('shortid');
const gs = require('ghostscript4js')
const fs = require('fs');
const utils = require('./helpers/utils');
const constants = require('./helpers/constants');
const executeCommands = require('./helpers/executeCommands');

const convertWithOptions = (uploadedFile, compressionLevel, callback) => {
    const { bytesToSize, getPercentageChange, newFileIsLarger, setCompressionType } = utils
    const { compressPdfCommand } = executeCommands;
    const { COMPRESSED_FILENAME, DEFAULT_FOLDER_PATH, DEFAULT_SHORT_FOLDER_PATH, GENERIC_ERROR, GS_ERROR_ENCRYPTED, FILE_LARGER, FILE_ENCRYPTED } = constants

    try {
        const convertedDocFileName = `${shortid.generate()}${COMPRESSED_FILENAME}`;
        const enterPath = uploadedFile.path;
        const outputPath = `${DEFAULT_FOLDER_PATH}${convertedDocFileName}`;
        const compression = setCompressionType(compressionLevel);
        const cmd = compressPdfCommand(compression, enterPath, outputPath);

        const fileInitial = fs.statSync(enterPath);
        gs.execute(cmd).then(() => {
            const fileProcessed = fs.statSync(outputPath);
            const couldNotCompress = newFileIsLarger(fileProcessed.size, fileInitial.size)
            if (couldNotCompress) {
                return callback({ error: FILE_LARGER });
            }
            else {
                return callback(compressSuccessResponse(DEFAULT_SHORT_FOLDER_PATH + convertedDocFileName,
                    bytesToSize(fileInitial.size), bytesToSize(fileProcessed.size),
                    getPercentageChange(fileInitial.size, fileProcessed.size).toFixed(2)))
            }
        }).catch((err) => {
            if (err.message === GS_ERROR_ENCRYPTED) {
                return callback({ error: FILE_ENCRYPTED });
            } else {
                return callback({ error: GENERIC_ERROR })
            }
        });
    }
    catch (err) {
        console.log(err.message)
        return callback({ error: GENERIC_ERROR })
    }
}

const convert = (uploadedFile, compressionLevel, callback) => convertWithOptions(uploadedFile, compressionLevel, callback)

const compressSuccessResponse = (downloadUrl, initialSize, reducedSize, percentage) => {
    return {
        downloadUrl: downloadUrl,
        initialSize: initialSize,
        reducedSize: reducedSize,
        percentage: percentage
    };
};

module.exports = {
    convert,
    convertWithOptions
}