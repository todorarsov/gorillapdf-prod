const express = require('express')
,slashes = require('connect-slashes');
const path = require('path');
const index = require('./modules/index');
const app = express();
const handleErrors = require('./modules/errorHandler');
const i18n = require('./modules/languageHelper');
const cookieParser = require('cookie-parser');

const requestIp = require('@supercharge/request-ip');
const { port } = require('./config')
const { isAllowedPath } = require('./modules/routeHelper');
const oneMonth = 2592000000;    // 3600000msec == 1hour

const oneHour = 3600000;
const compression = require('compression')

app.use(cookieParser('secret'));
app.use(i18n.init);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// set path for static assets
app.use(compression())
app.use('/blog', express.static('blog/public',{ maxAge: oneHour }));

app.use(express.static(path.join(__dirname, 'public'),{ maxAge: oneHour }))
    .use(slashes(false));


// routes
app.use('/', index);

app.use(function(req, res, next) {
    if(isAllowedPath(req.url)){
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
    else
    {
        res.render('error', { status: err.status, message: err.message, page: 'Not found', root });
    }
   
});
   
app.use(function(err, req, res, next) {
    const ip = requestIp.getClientIp(req)
    if(ip!=="::1")
    console.log(`Client IP: ${ip}`)

    let root = res.__('root');
    
    if(err.name === "MulterError") {
        try {
            new handleErrors(req, res, err).handleErrors();
        } catch(error) {
            console.log(error);
        }
    } else {
        res.status(err.status || 500);
        res.render('error', { status: err.status, message: err.message, page: 'Not found', root });
    }
});

app.use(function(req, res, next) {
    if(req.header('x-forwarded-proto') !== 'https') {
        res.redirect('https://' + req.headers.host.replace(/^www\./, '') + req.url, 301);
    } else {
        next();
    }
})

app.listen(port, function() {
    console.log("Live at Port:"+port);
    ('http://localhost:'+ port);
});

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node docs)
})

module.exports = app;