let i18n = require('i18n');
i18n.configure({
   // locales: ['en', 'fr', 'es', 'de', 'pt', 'ja' ],
   locales: ['en', 'fr', 'es', 'de', 'pt', 'ja', 'it', 'tr', 'zh', 'ru', 'id', 'mk', 'ms', 'uk' ],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    cookie: 'lang',
    objectNotation: true
});
module.exports = i18n;