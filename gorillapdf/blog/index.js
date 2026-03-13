'use strict';

exports = module.exports = function(app) {

    var path = require('path');
    var blogDirPath = path.join(__dirname);
    console.log("Blog path:" + blogDirPath);
    var Hexo = require("hexo");
    var hexo = new Hexo(blogDirPath, {});

    return require('x-hexo-app-express')(app, hexo);

};