const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const userDao = require("../User/userDao");
const lectureDao = require("./lectureDao");
const {query} = require("winston");


exports.getLectureList = async function() {
    const connection = await pool.getConnection(async (conn) => conn);

    const resultList = await lectureDao.selectLectureList(connection);
    const tagResult = await lectureDao.selectLectureTag(connection);
    const middleResult = await lectureDao.selectLectureMiddle(connection);
    // console.log(tagResult);
    console.log(middleResult);

    let map = new Map();
    // console.log("쌩 map: " + map);
    // [{id:1,name:스프링 강의},{id:2,name: 디자인 패턴 강의}]

    // {id:1,name:스프링 강의} -> row, {id:2,name: 디자인 패턴 강의} -> row
    await resultList.forEach(function (row) {
        // row = {id:1,name:스프링 강의,tag:[]}
        row.MIDDLE_CATEGORY_NAME = [];
        row.TAG = [];

        // row.tag = [] -> row에 tag배열 추가.

        // console.log("resultList_row:" + row.tag);
        //map(1) -> {id:1,name:스프링 강의,tag:[]}
        //map(2) -> {id:2,name: 디자인 패턴 강의,tag:[]}
        map.set(row.LECTURE_ID, row);
        // console.log(row.LECTURE_ID);
        // console.log(map.get(1));
        // console.log(map.has(row.LECTURE_ID));
        // console.log(map.size);
        // console.log(map.keys());
        // console.log(row);

    });

    await middleResult.forEach(function (row) {
        let lecture = map.get(row.LECTURE_ID);
        console.log(lecture);
        lecture.MIDDLE_CATEGORY_NAME.push(row.MIDDLE_CATEGORY_NAME);
        map.set(row.LECTURE_ID, lecture);
    });

    // console.log(map);
    // [{id:1, name:backend}, {id:1, name:java}, {id:2 , name:java}]
    await tagResult.forEach(function (row) {
        //{id:1,name:스프링 강의,tag:[]}
        let lecture = map.get(row.LECTURE_ID);
        //{id:1,name:스프링 강의,tag:[{id:1, name:backend}]}
        //{id:1,name:스프링 강의,tag:[{id:1, name:backend}, {id:1, name:java}]}
        lecture.TAG.push(row.CATEGORY_TAG_NAME);
        //map(1) ->{id:1,name:스프링 강의,tag:[{id:1, name:backend}]}
        //map(1) ->{id:1,name:스프링 강의,tag:[{id:1, name:backend}, {id:1, name:java}]}
        map.set(row.LECTURE_ID, lecture);
        // console.log(lecture);
    });

    // console.log(map);


    connection.release();

    return response(baseResponse.SUCCESS("강의정보 조회에 성공했습니다."), Object.fromEntries(map));
}

exports.checkUserLecture = async function (id, lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserLectureRow = await lectureDao.selectUserHaveLecture(connection, id, lectureId);
    connection.release();

    return checkUserLectureRow;
}

exports.checkLecture = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkLectureRow = await lectureDao.selectLecture(connection, lectureId);
    connection.release();
    return checkLectureRow;
}

exports.selectLectureHeader = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectHeaderRows = await lectureDao.selectLectureHeader(connection, lectureId);
    connection.release();

    return selectHeaderRows[0];
}

exports.selectLectureStudentCount = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectStudentCountRow = await lectureDao.selectLectureStudentCount(connection, lectureId);
    connection.release();

    if (!selectStudentCountRow) return 0;

    return selectStudentCountRow[0].STUDENTS_CNT;
}

exports.selectLecturePreviewCount = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectPreviewCount = await lectureDao.selectLecturePreviewCount(connection, lectureId);
    connection.release();

    if (!selectPreviewCount) return 0;

    return selectPreviewCount[0].PREVIEWS;
}

exports.selectLectureCategory = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectLectureTagRows = await lectureDao.selectLectureCategory(connection, lectureId);

    if (!selectLectureTagRows) return [];

    return selectLectureTagRows[0];
}

exports.selectLectureTags = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectLectureTagRows = await lectureDao.selectLectureTags(connection, lectureId);
    connection.release();

    if (!selectLectureTagRows) return [];

    return selectLectureTagRows;
}


exports.selectLectureIntroduction = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectLectureIntroduction = await lectureDao.selectLectureIntroduction(connection, lectureId);
    connection.release();

    return selectLectureIntroduction[0];
}

exports.selectLectureSessions = async function(lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectLectureSessionRows = await lectureDao.selectLectureSession(connection, lectureId);
    connection.release();

    return selectLectureSessionRows;
}

exports.selectSessionClasses = async function (sessionId) {
    const connection =  await pool.getConnection(async (conn) => conn);
    const selectClasses = await lectureDao.selectSessionClasses(connection, sessionId);
    connection.release();

    if(!selectClasses) return [];

    return selectClasses;
}

exports.selectLectureReviews = async function (lectureId) {
    const connection =  await pool.getConnection(async (conn) => conn);
    const selectReviews = await lectureDao.selectLectureReviews(connection, lectureId);
    connection.release();

    if(!selectReviews) return [];

    return selectReviews;
}

exports.checkUserLectureReview = async function (userId, reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserReview = await lectureDao.selectUserLectureReview(connection, userId, reviewId);
    connection.release();

    return selectUserReview;
}

exports.selectLectureNotice = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectLectureNoticeResult = await lectureDao.selectLectureNotice(connection, lectureId);
    connection.release();

    return selectLectureNoticeResult;
}

exports.checkLectureUser = async function (userId, lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectLectureUser = await lectureDao.selectLectureUser(connection, userId, lectureId);
    connection.release();

    return selectLectureUser;
}

exports.checkUserLectureNotice = async function (noticeId, userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserLectureNotice = await lectureDao.selectLectureNoticeUser(connection, noticeId, userId);
    connection.release();

    return selectUserLectureNotice;
}