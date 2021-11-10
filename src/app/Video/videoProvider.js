const {pool} = require("../../../config/database");
const videoDao = require('./videoDao');

exports.selectWatchedVideo = async function (userId, classId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const selectWatchedVideo = await videoDao.selectWatchedVideo(connection,  userId, classId);

    connection.release();

    return selectWatchedVideo;
};

exports.selectUserLectureHistory = async function (userId, sessionId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userParams = [userId, sessionId];

    const selectUserLecture = await videoDao.selectUserLectureList(connection, userParams);

    return selectUserLecture;
}