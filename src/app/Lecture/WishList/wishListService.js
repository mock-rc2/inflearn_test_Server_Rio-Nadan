const {logger} = require("../../../../config/winston");
const {pool} = require("../../../../config/database");
const secret_config = require("../../../../config/secret");
const baseResponse = require("../../../../config/baseResponseStatus");
const {response} = require("../../../../config/response");
const {errResponse} = require("../../../../config/response");
const wishListDao = require("./wishListDao");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.createWishList = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const resultRows = await wishListDao.insertWishList(connection, userId);

        if(resultRows.affectedRows == 0)
            return errResponse(baseResponse.CREATE_WISH_LIST_FAIL);

        return resultRows.insertId;
    }catch (err){
        await connection.rollback();
        logger.error(`App - createWishList Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}

exports.insertWishListItem = async function (wishListId, lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const resultRows = await wishListDao.insertWishListItem(connection, wishListId, lectureId);

        if(resultRows.affectedRows == 0)
            return errResponse(baseResponse.INSERT_WISH_LIST_ITEM_FAIL);

        return response(baseResponse.SUCCESS("위시리스트 저장 성공"));
    }catch (err){
        await connection.rollback();
        logger.error(`App - createWishListItem Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}