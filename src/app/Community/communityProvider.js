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

exports.getBoardList = async function(type,page,pageSize){
    const connection = await pool.getConnection(async (conn)=> conn);

    let start = 0;
    // 차트 길이를 알기 위한 임시 쿼리
    const boardLength = await communityDao.boardListLength(connection,type);
    if(page > Math.ceil(boardLength[0].Length/pageSize)){
        page = Math.ceil(boardLength[0].Length/pageSize); // 마지막 페이지 이상을 넘어서면 가장 마지막 페이지를 보여주도록 설계
    }
    if(page<=0){
        page = 1;
    }
    else{
        start = (page-1) * pageSize;
    }

    const selectBoardsListResult = await communityDao.selectBoardList(connection,type,Number(start),Number(pageSize));

    connection.release();
    return response(baseResponse.SUCCESS("강의 목록 조회에 성공했습니다"),selectBoardsListResult);

}

exports.getBoardListSort = async function(type,sortQuery,page,pageSize){

    const connection = await pool.getConnection(async (conn)=>conn);

    let start = 0;

    const boardLength = await communityDao.boardListLength(connection,type);

    if(page > Math.ceil(boardLength[0].Length/pageSize)){

        page = Math.ceil(boardLength[0].Length/pageSize); // 마지막 페이지 이상을 넘어서면 가장 마지막 페이지를 보여주도록 설계
    }
    if(page<=0){
        page = 1;
    }
    else{
        start = (page-1) * pageSize;
    }

    let orderBy;
    switch (sortQuery) {
        case 'created':
            orderBy = 'order by DATE desc';
            break;

        case 'comment':
            orderBy = 'order by cnt desc';
            break;

        default :
            return errResponse(baseResponse.SORT_TYPE_ERROR);
            break;
    }
    console.log("start : " + start + " pageSize : " + pageSize);
    const selectSortedBoardsListResult = await communityDao.selectSortedBoardList(connection,type,orderBy,Number(start),Number(pageSize));

    connection.release();

    return response(baseResponse.SUCCESS("강의 목록 조회에 성공했습니다"),selectSortedBoardsListResult);
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