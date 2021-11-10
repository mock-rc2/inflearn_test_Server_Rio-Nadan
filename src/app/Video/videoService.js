const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const {pool} = require("../../../config/database");
const videoDao = require('./videoDao');
const {logger} = require("../../../config/winston");
const {exceptions} = require("winston");
const lectureProvider = require('../Lecture/lectureProvider');
const videoProvider = require('./videoProvider');


exports.insertWatchedVideo = async function(userId, lectureId, classId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const watchedParams = [userId, lectureId, classId, '00:00'];

        const insertWatchedTimeResult = await videoDao.insertWatchedVideo(connection, watchedParams);

        if(insertWatchedTimeResult.affectedRows == 0)
            return response(errResponse(baseResponse.INSERT_WATCHED_VIDEO_TIME_FAIL));

        return response(baseResponse.SUCCESS("첫 강의 시청 저장에 성공하였습니다."), {'HISTORY_ID': insertWatchedTimeResult.insertId, 'CLASS_ID': classId, 'WATCHED_TIME': '00:00'});
    }catch (err){
        await connection.rollback();
        logger.error(`App - insert watched video Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}

exports.updateWatchedVideo = async function(historyId, watchedTime) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const updateParams = [watchedTime, historyId];

        const updateWatchedTimeResult = await videoDao.updateWatchedVideo(connection, updateParams);

        if(updateWatchedTimeResult.affectedRows == 0)
            return response(errResponse(baseResponse.UPDATE_WATCHED_VIDEO_TIME_FAIL));

        return response(baseResponse.SUCCESS("강의 시청 저장에 성공하였습니다."));
    }catch (err){
        await connection.rollback();
        logger.error(`App - update watched video Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}

exports.selectUserLectureList = async function(userId, lectureId) {
    try{
        const sessionRows = await lectureProvider.selectLectureSessions(lectureId);

        for(let i = 0; i<sessionRows.length; i++) {
            sessionRows[i].CLASS = await videoProvider.selectUserLectureHistory(userId, sessionRows[i].SESSION_ID);
        }

        return response(baseResponse.SUCCESS("강의 시청 목록 조회에 성공하였습니다."), sessionRows);
    }catch (err){
        logger.error(`App - select user watched video Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }
}

exports.updateWatchedVideoCompleteInfo = async function(historyId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const completeCheck = await videoDao.updateClassLearningInfo(connection, historyId);
        if(completeCheck.affectedRows == 0)
            return response(errResponse(baseResponse.USER_UPDATE_CLASS_COMPLETE_FAIL));

        return response(baseResponse.SUCCESS("강의 완료가 성공하였습니다."));
    }catch (err){
        await connection.rollback();
        logger.error(`App - update user class complete Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}