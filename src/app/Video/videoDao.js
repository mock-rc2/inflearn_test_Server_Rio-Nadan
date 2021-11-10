async function selectWatchedVideo(connection, userId, classId) {
    const selectWatchedVideoQuery = `
        SELECT HISTORY_ID, CLASS_ID, WATCHED_TIME
        FROM USER_CLASS_HISTORIES
        WHERE USER_ID = ? AND CLASS_ID = ?;
    `;

    const [resultRows] = await connection.query(
        selectWatchedVideoQuery,
        [userId, classId]
    );

    return resultRows
}

async function insertWatchedVideo(connection, videoParams) {
    const insertWatchedVideoQuery = `
        INSERT INTO USER_CLASS_HISTORIES(USER_ID, LECTURE_ID, CLASS_ID, WATCHED_TIME)
            VALUES (?, ?, ?, ?)
    `;

    const [resultRows] = await connection.query(
        insertWatchedVideoQuery,
        videoParams
    );

    return resultRows
}

async function updateWatchedVideo(connection, updateHistoryParams) {
    const updateWatchedVideoQuery = `
        UPDATE USER_CLASS_HISTORIES
        SET WATCHED_TIME = ?
        WHERE HISTORY_ID = ?
    `;

    const [resultRows] = await connection.query(
        updateWatchedVideoQuery,
        updateHistoryParams
    );

    return resultRows;
}

module.exports = {
    selectWatchedVideo,
    insertWatchedVideo,
    updateWatchedVideo
}

