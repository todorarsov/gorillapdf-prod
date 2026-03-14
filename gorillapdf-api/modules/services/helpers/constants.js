const DEFAULT_FOLDER_PATH = 'public//uploads//';
const DEFAULT_SHORT_FOLDER_PATH = '/uploads/';
const GS_ERROR_ENCRYPTED = 'Sorry error happened executing Ghostscript command. Error code: -100'
const GENERIC_ERROR = 'GenericError';
const ENCODING_UTF_16_LE = 'UTF-16LE';
const ENCODING_UTF_8 = 'utf8';
const FILE_ENCRYPTED= 'FileEncrypted';
const FILE_LARGER= 'FileLarger';
const FILE_LIMIT= 'FileLimit';
const PASSWORD_INCORRECT = 'PasswordIncorrect';
const COMPRESSED_FILENAME = '_compressed.pdf';
const ENCRYPTED_FILENAME = '_encrypted.pdf';
const TXT_TO_PDF_FILENAME = '_txtToPdf.pdf';
const PNG_TO_PDF_FILENAME = '_pngToPdf.pdf';



module.exports = {
    COMPRESSED_FILENAME,
    DEFAULT_FOLDER_PATH,
    DEFAULT_SHORT_FOLDER_PATH,
    ENCRYPTED_FILENAME,
    ENCODING_UTF_8,
    ENCODING_UTF_16_LE,
    PASSWORD_INCORRECT,
    GENERIC_ERROR,
    GS_ERROR_ENCRYPTED,
    FILE_ENCRYPTED,
    FILE_LARGER,
    PNG_TO_PDF_FILENAME,
    TXT_TO_PDF_FILENAME,
    FILE_LIMIT
}