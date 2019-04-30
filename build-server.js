const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const api = require('./api');

module.exports = (cb) => {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors());
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));
  app.use('/api', api);
  app.use('*', (req, res) => res.status(404).end());
  mongoose.connect('mongodb://127.0.0.1/ps6', {useNewUrlParser: true, useCreateIndex: true});
  mongoose.set('debug', true);
  const server = app.listen(process.env.PORT || 9428, () => cb && cb(server));
};
