const express = require('./config/express');
const {logger} = require('./config/winston');
const hls = require('./config/hls-server');
const fs = require('fs');
const port = 3001;

const server = express().listen(port);
const hlsServer = hls.run(__dirname, server);

logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);