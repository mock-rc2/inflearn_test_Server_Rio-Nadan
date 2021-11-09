const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const {pool} = require("../../../config/database");
const videoDao = require('./videoDao');
const {logger} = require("../../../config/winston");
const {exceptions} = require("winston");

exports.insertWatchedVideo = async function(userId, lectureId, classId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const watchedParams = [userId, lectureId, classId, '00:00'];

        const insertWatchedTimeResult = await videoDao.insertWatchedVideo(connection, watchedParams);

        if(insertWatchedTimeResult.affectedRows == 0)
            return response(errResponse(baseResponse.INSERT_WATCHED_VIDEO_TIME_FAIL));

        return response(baseResponse.SUCCESS("첫 강의 시청 저장에 성공하였습니다."), {'CLASS_ID': classId, 'WATCHED_TIME': '00:00'});
    }catch (err){
        await connection.rollback();
        logger.error(`App - insert watched video Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}

exports.updateWatchedVideo = async function(userId, classId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const watchedParams = [userId, classId];

        const updateWatchedTimeResult = await videoDao.updateWatchedVideo(connection, watchedParams);

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