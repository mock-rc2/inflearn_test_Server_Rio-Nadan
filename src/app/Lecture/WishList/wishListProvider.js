const { pool } = require("../../../../config/database");
const { logger } = require("../../../../config/winston");
const baseResponse = require("../../../../config/baseResponseStatus");
const {response} = require("../../../../config/response");
const {errResponse} = require("../../../../config/response");
const userDao = require("../../User/userDao");
const lectureDao = require("../lectureDao");
const wishListDao = require('./wishListDao');
const lectureProvider = require("../lectureProvider");

exports.selectUserWishList = async function(userId){
    const connection = await pool.getConnection(async (conn)=>conn);

    const resultRows = await wishListDao.selectWishList(connection, userId);

    return resultRows;

}
