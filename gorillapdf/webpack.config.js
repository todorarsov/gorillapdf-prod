const path = require('path');

module.exports = {
  entry: [
  //   path.resolve(__dirname,'./public/javascripts/ejs.min.js'),
  //   path.resolve(__dirname,'./public/javascripts/notyf.min.js'),
  //   path.resolve(__dirname,'./public/javascripts/axios.min.js'),
  //   path.resolve(__dirname,'./public/javascripts/bootstrap.min.js'),
  //   path.resolve(__dirname,'./public/javascripts/filepond.min.js'),
  //   path.resolve(__dirname,'./public/javascripts/filepond-plugins.min.js'),
  //   path.resolve(__dirname,'./public/javascripts/rater.js'),
    path.resolve(__dirname, './public/javascripts/gorillaHelper.js'),
  ],
  output: {
    path: path.join(__dirname, './public/javascripts/dist'),
    publicPath: '/',
    filename: 'gorillaHelper.js'
  },
  
};


