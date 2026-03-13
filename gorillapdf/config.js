// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  env: process.env.NODE_ENV,
  useDb: process.env.USE_DB,
  port: process.env.PORT
};