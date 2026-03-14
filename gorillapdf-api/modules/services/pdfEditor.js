module.exports = function(uploadedFile) {
    const libre = require('libreoffice-convert');
    const path = 'public//uploads//';
    const shortid = require('shortid');
    const fs = require('fs');
    let editedFileName = shortid.generate();
    this.uploadedFile = uploadedFile;
    this.convertFile = function(res) {
        try {
            console.log(this.uploadedFile.type);
            const enterPath = this.uploadedFile.path;
            editedFileName += '_edited.pdf';
            const dataBuffer = fs.readFileSync(enterPath);
            fs.writeFile(path+editedFileName, dataBuffer, function (err) {
                if (err) return console.log(err);
              });
              successResponse(res, '/uploads/' + editedFileName);

        } catch(error) {
            console.log(error);
            failedResponse(res);
        }
    };
    let successResponse = function(res, filePath) {
        res.json({
            downloadUrl: filePath,
        })
    };
    let failedResponse = function(res, translation) {
        res.json({ error: translation.genericError })
    };
}