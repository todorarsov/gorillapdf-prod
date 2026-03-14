
const isValidFormat = (mimeType, validMimeType) => {
    return mimeType === validMimeType;
  };
  
const sendJsonResponseToView = (res, responseFromService) => {
    res.json(responseFromService);
};

  exports.isValidFormat = isValidFormat;
  exports.sendJsonResponseToView = sendJsonResponseToView;
