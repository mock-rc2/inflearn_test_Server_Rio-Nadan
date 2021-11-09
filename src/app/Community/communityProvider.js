const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const userDao = require("../User/userDao");
const lectureDao = require("./lectureDao");
const {query} = require("winston");
