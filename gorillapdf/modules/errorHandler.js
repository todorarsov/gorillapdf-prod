module.exports = function(req, res, err) {
    this.req = req;
    this.res = res;
    this.err = err;
    this.referer = req.url.replace('/', '');
    this.handleErrors = function() {
        try {
            if (this.err.message === "File too large") {
                this.res.render(this.referer, { page: '', content: '', validationMessage: 'File is too large. Please select another file.' });
            }
        } catch (e) {
            console.log(e);
        }

    };


}