const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { config } = require('./config');
const apiRouter = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Global Middlewares
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Mount API v1 Dispatcher
app.use('/api/v1', apiRouter);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;