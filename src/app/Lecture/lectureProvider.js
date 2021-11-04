const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const lectureDao = require("./lectureDao");
const userDao = require("../User/userDao");

exports.checkUserLecture = async function(id, lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserLectureRow = await lectureDao.selectUserHaveLecture(connection, id, lectureId);
    connection.release();

    return checkUserLectureRow;
}

exports.checkLecture = async function(lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkLectureRow = await lectureDao.selectLecture(connection, lectureId);
    connection.release();
    return checkLectureRow;
}

exports.selectLectureHeader = async function(lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectHeaderRows = await lectureDao.selectLectureHeader(connection, lectureId);
    connection.release();

    return selectHeaderRows[0];
}

exports.selectLectureStudentCount = async function(lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectStudentCountRow = await lectureDao.selectLectureStudentCount(connection, lectureId);
    connection.release();

    if(!selectStudentCountRow) return 0;

    return selectStudentCountRow[0].STUDENTS_CNT;
}

exports.selectLecturePreviewCount = async function(lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectPreviewCount = await lectureDao.selectLecturePreviewCount(connection, lectureId);
    connection.release();

    if(!selectPreviewCount) return 0;

    return selectPreviewCount[0].PREVIEWS;
}

exports.selectLectureCategory = async function(lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectLectureTagRows = await lectureDao.selectLectureCategory(connection, lectureId);

    if(!selectLectureTagRows) return [];

    return selectLectureTagRows[0];
}

exports.selectLectureTags = async function(lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectLectureTagRows = await lectureDao.selectLectureTags(connection, lectureId);
    connection.release();

    if(!selectLectureTagRows) return [];

    return selectLectureTagRows;
}