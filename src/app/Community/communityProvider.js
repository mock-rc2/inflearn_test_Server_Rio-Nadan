const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const communityDao = require("../Community/communityDao");
const communityService = require("../Community/communityService");
const userDao = require("../User/userDao");
const lectureDao = require("../Lecture/lectureDao");
const {query} = require("winston");
const communityProvider = require("../Community/communityProvider");

exports.getBoardList = async function(type){
    const connection = await pool.getConnection(async (conn)=> conn);

    const selectBoardsListResult = await communityDao.selectBoardList(connection,type);

    connection.release();
    return selectBoardsListResult;

}

exports.checkBoardExist = async function(boardId){
    const connection = await pool.getConnection(async (conn)=> conn);

    const checkResult = await communityDao.checkQuestionBoard(connection,boardId);

    connection.release();
    return checkResult;

}

exports.checkBoardIsMine = async function(boardId,userId){
    const connection = await pool.getConnection(async (conn)=> conn);

    const checkResult = await communityDao.checkQuestionBoardIsMine(connection,boardId,userId);

    connection.release();
    return checkResult;

}

exports.getBoardType = async function(boardId){
    const connection = await pool.getConnection(async (conn)=>conn);

    const checkResult = await communityDao.checkBoardType(connection,boardId);

    connection.release();
    return checkResult;
}


exports.getClassBoard = async function(boardType, classId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const boardParams = [boardType, classId]
    const getClassBoardResult = await communityDao.selectClassBoard(connection, boardParams)

    connection.release();

    return getClassBoardResult;
}

exports.getBoardInfo = async function(type,boardId){

    const connection = await pool.getConnection(async (conn)=>conn);

    const isExist = await communityProvider.checkBoardExist(boardId);

    if(isExist.length < 1)
        return errResponse(baseResponse.CHECK_BOARD_FAIL);

    const isBoardType = await communityProvider.getBoardType(boardId);

    if(isBoardType[0].BOARD_TYPE !== type)
        return errResponse(baseResponse.WRONG_BOARD_PATH);

    const boardResult = await communityDao.selectBoardInfo(connection,boardId,type);

    connection.release();

    return response(baseResponse.SUCCESS("게시글 조회에 성공했습니다"),boardResult);


}