const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const lectureProvider = require("../Lecture/lectureProvider");
const lectureDao = require("../Lecture/lectureDao");
const communityDao = require("../Community/communityDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const communityProvider = require("../Community/communityProvider");

exports.insertBoard = async function(params){

    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();


        const insertQuestionResult = await communityDao.insertBoard(connection,params);


        if(insertQuestionResult[0].affectedRows === 0) {
            await connection.rollback();
            return errResponse(baseResponse.INSERT_BOARD_FAIL);
        }

        await connection.commit();

        return response(baseResponse.SUCCESS("포스팅 성공"));

    }catch (err) {
        await connection.rollback();
        logger.error(`App - putLectureReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }

}

exports.updateQuestionBoard = async function(title,content,boardId,userId,type){
    const connection = await pool.getConnection(async (conn)=>conn);
    const params = [title,content,boardId,type];

    try{
        await connection.beginTransaction();

        const isExist = await communityProvider.checkBoardExist(boardId);

        if(isExist.length < 1)
            return errResponse(baseResponse.CHECK_BOARD_FAIL)

        const myBoard = await communityProvider.checkBoardIsMine(boardId,userId);

        if(myBoard.length < 1)
            return errResponse(baseResponse.UPDATE_BOARD_DENIED);


        const isBoardType = await communityProvider.getBoardType(boardId);

        if(isBoardType[0].BOARD_TYPE !== type)
            return errResponse(baseResponse.WRONG_BOARD_PATH);

        const updateQuestionResult = await communityDao.updateQuestionBoard(connection,params);

        if(updateQuestionResult[0].affectedRows === 0) {
            await connection.rollback();
            return errResponse(baseResponse.UPDATE_BOARD_FAIL);
        }
        await connection.commit();

        return response(baseResponse.SUCCESS("게시물 수정이 완료 되었습니다."));

    }catch (err) {
        await connection.rollback();
        logger.error(`App - putLectureReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }

}

exports.deleteBoard = async function(boardId,userId,type){
    const connection = await pool.getConnection(async (conn)=>conn);

    try{
        await connection.beginTransaction();

        const isExist = await communityProvider.checkBoardExist(boardId);

        if(isExist.length < 1)
            return errResponse(baseResponse.CHECK_BOARD_FAIL);

        const myBoard = await communityProvider.checkBoardIsMine(boardId,userId);

        if(myBoard.length < 1)
            return errResponse(baseResponse.UPDATE_BOARD_DENIED);

        const isQuestion = await communityProvider.getBoardType(boardId);

        if(isQuestion[0].BOARD_TYPE !== type)
            return errResponse(baseResponse.WRONG_BOARD_PATH);

        const deleteResult = await communityDao.deleteBoard(connection,boardId);

        if(deleteResult[0].affectedRows === 0) {
            await connection.rollback();
            return errResponse(baseResponse.DELETE_BOARD_FAIL);
        }

        await connection.commit();

        return response(baseResponse.SUCCESS("성공적으로 게시물을 삭제했습니다"))

    }catch (err) {
        await connection.rollback();
        logger.error(`App - putLectureReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}