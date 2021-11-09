const {pool} = require("../../../config/database");
const videoDao = require('./videoDao');

exports.selectWatchedVideo = async function (userId, classId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const selectWatchedVideo = await videoDao.selectWatchedVideo(connection,  userId, classId);

    connection.release();

    return selectWatchedVideo;
};
