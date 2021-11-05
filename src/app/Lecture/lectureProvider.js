const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const userDao = require("../User/userDao");
const lectureDao = require("./lectureDao");
const {query} = require("winston");



exports.getAllLectureList = async function() {
    const connection = await pool.getConnection(async (conn) => conn);

    const resultList = await lectureDao.selectLectureList(connection);
    const tagResult = await lectureDao.selectLectureTag(connection);
    const middleResult = await lectureDao.selectLectureMiddle(connection);
    // console.log(tagResult);
    // console.log(middleResult);

    let map = new Map();

    //console.log("쌩 map: " + map); // => 쌩 map: [object Map]
    // [{id:1,name:스프링 강의},{id:2,name: 디자인 패턴 강의}]

    // {id:1,name:스프링 강의} -> row, {id:2,name: 디자인 패턴 강의} -> row
    await resultList.forEach(function (row) {
        // row = {id:1,name:스프링 강의,MIDDLE_CATEGORY_NAME:[]}
        row.MIDDLE_CATEGORY_NAME = []; //row에 MIDDLE_CATEGORY_NAME 배열 추가.
        // row = {id:1,name:스프링 강의,MIDDLE_CATEGORY_NAME:[],TAG:[]}
        row.TAG = []; //row에 TAG배열 추가.

        //console.log("resultList_row:" + row.tag);// => resultList_row:undefined 아직 TAG row에는 아무것도 들어가지 않았음

        //map(1) -> {id:1,name:스프링 강의,tag:[]}
        //map(2) -> {id:2,name: 디자인 패턴 강의,tag:[]}
        map.set(row.LECTURE_ID, row);

        //console.log(row.LECTURE_ID); // => 1 2 4 5 6 7 8 lecture
        // console.log(map.get(1)); // map 에 key값 = 1 인 정보 불러오기(forEach이므로 반복해서 가져옴)
        // console.log(map.has(row.LECTURE_ID)); // true. 해당 map은 key로 row.LECTURE_ID를 씀
        // console.log(map.size); // map의 사이즈 1~7까지 순차적으로 표현.(forEach로 반복하여 개수가 증가함)
        // console.log(map.keys());
        // console.log(row);

    });

    await middleResult.forEach(function (row) {
        let lecture = map.get(row.LECTURE_ID);
        // console.log(lecture);
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

    return Object.fromEntries(map);
}

exports.getLectureList = async function(topCategoryName){
    const connection = await pool.getConnection(async (conn)=>conn);
    const getResultList = await lectureDao.selectTopLectureList(connection,topCategoryName);
    const middleResult = await lectureDao.selectTopLectureMiddle(connection,topCategoryName);
    const tagResult = await lectureDao.selectTopLectureTag(connection,topCategoryName);

    let map = new Map();

    await getResultList.forEach(function (row){
       row.MIDDLE_CATEGORY_NAME = [];
       row.TAG =[];

       map.set(row.LECTURE_ID,row);
       // console.log(map);
       // console.log(map.size);
    });

    await middleResult.forEach(function(row){
        let lecture = map.get(row.LECTURE_ID);
        //console.log(row)
        lecture.MIDDLE_CATEGORY_NAME.push(row.MIDDLE_CATEGORY_NAME);
        map.set(row.LECTURE_ID,lecture);
    });

    await tagResult.forEach(function(row){
        let lecture = map.get(row.LECTURE_ID);
        lecture.TAG.push(row.CATEGORY_TAG_NAME);
        map.set(row.LECTURE_ID,lecture);
    });

    connection.release();

    return Object.fromEntries(map);
}

exports.getMiddleLectureList = async function(topCategoryName,middleCategoryName){

    const connection = await pool.getConnection(async (conn)=>conn);

    const getResultList = await lectureDao.selectMiddleLectureList(connection,topCategoryName,middleCategoryName);
    const middleResult = await lectureDao.selectMiddleLecture(connection,topCategoryName,middleCategoryName);
    console.log(middleResult);
    // const tagResult = await lectureDao.selectMiddleLectureTag(connection,topCategoryName,middleCategoryName);

    connection.release();
    return getResultList

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
