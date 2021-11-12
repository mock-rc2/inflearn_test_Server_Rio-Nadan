const {logger} = require("../../../../config/winston");
const {pool} = require("../../../../config/database");
const secret_config = require("../../../../config/secret");
const baseResponse = require("../../../../config/baseResponseStatus");
const {response} = require("../../../../config/response");
const {errResponse} = require("../../../../config/response");
const paymentDao = require("./paymentDao");
const paymentProvider = require("./paymentProvider");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const lectureProvider = require("../../Lecture/lectureProvider");


exports.deleteCartItem = async function(userId,lectureId){

    const connection = await pool.getConnection(async (conn)=>conn);
    try{
        const checkLectureRow = await lectureProvider.checkLecture(lectureId);
        if(checkLectureRow.length < 1)
            return errResponse(baseResponse.LECTURE_NOT_EXISTENCE);

        const checkUserCart = await paymentDao.checkCartsItem(connection,userId,lectureId);
        if(checkUserCart.length < 1)
            return errResponse(baseResponse.CHECK_ITEM_NOT_EXIST);
        let basketId = checkUserCart[0].BASKET_ID;

        const deleteCartsItem = await paymentDao.deleteCartItem(connection,basketId,lectureId);
        if(deleteCartsItem[0].affectedRows ===0){
            await connection.rollback();
            return errResponse(baseResponse.DELETE_ITEM_FAIL);
        }

        return response(baseResponse.SUCCESS("강의를 성공적으로 수강바구니에서 삭제했습니다"))

    }catch (err) {
        await connection.rollback();
        logger.error(`App - putLectureReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }

}

exports.postCartItem = async function(userId,lectureId){

    const connection = await pool.getConnection(async (conn)=>conn);
    try{
        const checkLectureRow = await lectureProvider.checkLecture(lectureId);
        if(checkLectureRow.length < 1)
            return errResponse(baseResponse.LECTURE_NOT_EXISTENCE);

        const checkUserCart = await paymentDao.checkCartsItem(connection,userId,lectureId);
        if(checkUserCart.length === 1)
            return errResponse(baseResponse.ITEM_ALREADY_EXIST);

        const getUserBasketId = await paymentDao.selectUserBasketId(connection,userId);
        let basketId = getUserBasketId[0].BASKET_ID;

        const postCartsItem = await paymentDao.postCartItem(connection,basketId,lectureId);
        if(postCartsItem[0].affectedRows === 0){
            await connection.rollback();
            return errResponse(baseResponse.DELETE_ITEM_FAIL);
        }

        return response(baseResponse.SUCCESS("강의를 성공적으로 수강바구니에 추가했습니다"));

    }catch (err) {
        await connection.rollback();
        logger.error(`App - putLectureReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }

}

exports.deleteReceipt = async function(userId,userBuyId){

    const connection = await pool.getConnection(async (conn)=>conn);

    try{
        const checkUserBuy = await paymentDao.checkReceiptExist(connection,userId,userBuyId);
        if(checkUserBuy.length < 1)
            return errResponse(baseResponse.RECEIPT_NOT_EXIST);

        const deleteReceipt = await paymentDao.deleteReceipt(connection,userId,userBuyId);
        if(deleteReceipt[0].affectedRows === 0){
            await connection.rollback();
            return errResponse(baseResponse.DELETE_ITEM_FAIL);
        }

        return response(baseResponse.SUCCESS("성공적으로 결제 내역을 삭제했습니다"));

    }catch (err) {
        await connection.rollback();
        logger.error(`App - putLectureReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }

}