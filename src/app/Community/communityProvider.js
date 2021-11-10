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

exports.getQuestionList = async function(){
    const connection = await pool.getConnection(async (conn)=> conn);

    const selectQuestionListResult = await communityDao.selectQuestionList(connection);

    connection.release();
    return selectQuestionListResult;

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

exports.getClassBoard = async function(boardType, classId){
    const connection = await pool.getConnection(async (conn)=>conn);
    const boardParams = [boardType, classId]
    const getClassBoardResult = await communityDao.selectClassBoard(connection, boardParams)

    connection.release();

    return getClassBoardResult;
}