const multer = require('multer');

const handleMulterErrors = (req, res, err) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return 'FileLimit'
        }
    } else if (err) {
        return 'GenericError'
    }
    else
    {
        return 'NoError'
    }
  };

  exports.handleMulterErrors = handleMulterErrors;
