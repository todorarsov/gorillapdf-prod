    const path = './uploads';
    const shortid = require('shortid');
    const fs = require('fs');
    const pdf = require('pdf-thumbnail');
    var convertedDocFileName = shortid.generate();

    const previewFile = (uploadedFile, callback) => {
            pdf(fs.readFileSync(uploadedFile.destination))
                .then(data => {
                    data.pipe(fs.createWriteStream(path + convertedDocFileName + "_previewBuffer.jpg"))
                    return callback('/uploads/' + convertedDocFileName);
                })
                .catch(err => callback(err))
    }

  module.exports = {
    previewFile, 
}
