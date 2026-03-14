
const { port, apiHost, env} = require('./config')

const express = require('express');
const path = require('path');
const findRemoveSync = require('find-remove')
const index = require('./modules/routes/index');
const app = express();
const cors = require('cors');
const requestIp = require('@supercharge/request-ip')
const blocked = require('blocked-at')

const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(), // adds a timestamp property
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//Add cors
var allowedOrigins = ['http://localhost:3001',
'https://localhost:3001',
'http://localhost:3006',
'https://localhost:3006',
'http://localhost:5001',
'https://localhost:5001',
'http://gorillapdf.com',
'https://gorillapdf.com'];

app.use(cors({  
  origin: function(origin, callback){
    // allow requests with no origin     
    // (like mobile apps or curl requests)    
    if(!origin) 
      return callback(null, true);    
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +                
          'allow access from the specified Origin.';      
      return callback(new Error(msg), false);    
    }    
    return callback(null, true);  
  }
}));

// routes
app.use('/', index);
app.use('/', require('./modules/routes/routeCompressPdf'));
app.use('/', require('./modules/routes/routeExcelToPdf'));
app.use('/', require('./modules/routes/routeJpgToPdf'));
app.use('/', require('./modules/routes/routeOdpToPdf') );
app.use('/', require('./modules/routes/routeOdsToPdf'));
app.use('/', require('./modules/routes/routeOdtToPdf'));
app.use('/', require('./modules/routes/routePasswordProtect'));
app.use('/', require('./modules/routes/routePngToPdf'));
app.use('/', require('./modules/routes/routePptToPdf'));
app.use('/', require('./modules/routes/routeTxtToPdf'));
app.use('/', require('./modules/routes/routeUnlockPdf'));
app.use('/', require('./modules/routes/routeWordToPdf'));
app.use('/', require('./modules/routes/routeOnlineOcr'));
app.use('/', require('./modules/routes/routeMergePdf'));
app.use('/', require('./modules/routes/routeHtmlToPdf'));
app.use('/', require('./modules/routes/routePdfToTxt'));
app.use('/', require('./modules/routes/routePdfToWord'));

app.get('/', (res) => {
    res.render('index');
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;

    next(err);
    res.status(404).end('Not Found');
});



app.use(function(err, req, res) {
    const ip = requestIp.getClientIp(req)
    if(ip!=="::1")
    console.log(`Client IP: ${ip}`)

    if(err.name === "MulterError") {
        try {
          if (this.err.message === "File too large") {
                res.json({ error: 'GenericError'})
            }
        } catch(error) {
            res.json({ error: 'GenericError'})

        }
    } else {
        res.json({ error: 'GenericError'})
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
    logger.info("Live at Port:"+port);
    ('http://localhost:'+port, {app: 'chrome'});
});

blocked((time, stack) => {
    //console.log(`Blocked for ${time}ms, operation started here:`, stack)
  })

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
})

const intervalFunc = () => {
    var removed = findRemoveSync(path.join(__dirname, 'public\\uploads'), { files: '*.*', age: { seconds: 7200 } }); //older by 2 hours
    if(removed.length > 0) {
        //console.log('removed:', removed);
    }
}
setInterval(intervalFunc, 43200000); //every 1 hours

module.exports = app;