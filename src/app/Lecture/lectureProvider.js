const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const userDao = require("../User/userDao");
const lectureDao = require("./lectureDao");
const {query} = require("winston");



/*exports.getAllLectureList = async function(tagName) {

    const connection = await pool.getConnection(async (conn) => conn);

    const resultList = await lectureDao.selectLectureList(connection);
    const tagResult = await lectureDao.selectLectureTag(connection);
    const middleResult = await lectureDao.selectLectureMiddle(connection);

    let map = new Map();

    //console.log("쌩 map: " + map); // => 쌩 map: [object Map]
    // [{id:1,name:스프링 강의},{id:2,name: 디자인 패턴 강의}]

    // {id:1,name:스프링 강의} -> row, {id:2,name: 디자인 패턴 강의} -> row
    await resultList.forEach(function (row) {
        // row = {id:1,name:스프링 강의,MIDDLE_CATEGORY_NAME:[]}
        row.MIDDLE_CATEGORY_NAME = []; //row에 MIDDLE_CATEGORY_NAME 배열 추가.
        // row = {id:1,name:스프링 강의,MIDDLE_CATEGORY_NAME:[],TAG:[]}
        row.TAG = []; //row에 TAG배열 추가.

        map.set(row.LECTURE_ID, row);

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


    // console.log(resultRow);
    if(tagName){
        let tagSet;
        let result = [];
        console.log(resultRow); // Java ,Back-End
        if(tagName){
            tagSet = new Set(tagName.split(','));
        }
        map.forEach((key, value) =>{
        });
        connection.release();

        return result;
    }else{
        connection.release();

        return resultRow;
    }


}*/

exports.getFilterLectureList = async function(tagRow) {
    const connection = await pool.getConnection(async (conn)=>conn);

    if(tagRow){
        let tags = tagRow.split(',');
        let where = await lectureDao.buildQuery(tags);
        console.log(where);
    }

    const lectureResult = await lectureDao.selectLectureList(connection);

    for (const row of lectureResult) {
        row.MIDDLE_CATEGORY_NAME = [];
        row.TAG = [];
        console.log(row.LECTURE_ID);
        const tagResult = await lectureDao.selectLectureMiddle(connection,row.LECTURE_ID);
        await tagResult.forEach((tag) => {
            row.MIDDLE_CATEGORY_NAME.push(tag.MIDDLE_CATEGORY_NAME);
        });
    }

    console.log(lectureResult);

    connection.release();

    return lectureResult;
}

exports.checkBigCategoryList = async function(bigCategoryName){
    const connection = await pool.getConnection(async (conn)=>conn);
    const checkResult = await lectureDao.checkBigCategory(connection,bigCategoryName);
    console.log("checkResult:" + checkResult);

    connection.release();

    return checkResult;
}

exports.getLectureList = async function(bigCategoryName,tagName) {
    //console.log(tagName);
    const connection = await pool.getConnection(async (conn) => conn);
    const getResultList = await lectureDao.selectTopLectureList(connection, bigCategoryName);
    const middleResult = await lectureDao.selectTopLectureMiddle(connection, bigCategoryName);
    const tagResult = await lectureDao.selectTopLectureTag(connection, bigCategoryName);

    let map = new Map();

    await getResultList.forEach(function (row) {
        row.MIDDLE_CATEGORY_NAME = [];
        row.TAG = [];

        map.set(row.LECTURE_ID, row);
        // console.log(map);
        // console.log(map.size);
    });

    await middleResult.forEach(function (row) {
        let lecture = map.get(row.LECTURE_ID);
        //console.log(row)
        lecture.MIDDLE_CATEGORY_NAME.push(row.MIDDLE_CATEGORY_NAME);
        map.set(row.LECTURE_ID, lecture);
    });

    await tagResult.forEach(function (row) {
        let lecture = map.get(row.LECTURE_ID);
        lecture.TAG.push(row.CATEGORY_TAG_NAME);
        map.set(row.LECTURE_ID, lecture);
    });

    let ref = Object.fromEntries(map);

    connection.release();

    return response(baseResponse.SUCCESS("강의 목록 조회에 성공 했습니다"),resultRow);

}

exports.getMiddleLectureList = async function(bigCategoryName,middleCategoryName,tagName){

    const connection = await pool.getConnection(async (conn)=>conn);

    const getResultList = await lectureDao.selectMiddleLectureList(connection,bigCategoryName,middleCategoryName);
    const middleResult = await lectureDao.selectMiddleLecture(connection,bigCategoryName,middleCategoryName);
    const tagResult = await lectureDao.selectMiddleLectureTag(connection,bigCategoryName,middleCategoryName);

    let map = new Map();

    await getResultList.forEach(function (row) {
        row.MIDDLE_CATEGORY_NAME = [];
        row.TAG = [];

        map.set(row.LECTURE_ID, row);
        // console.log(map);
        // console.log(map.size);
    });

    await middleResult.forEach(function (row) {
        let lecture = map.get(row.LECTURE_ID);
        //console.log(row)
        lecture.MIDDLE_CATEGORY_NAME.push(row.MIDDLE_CATEGORY_NAME);
        map.set(row.LECTURE_ID, lecture);
    });

    await tagResult.forEach(function (row) {
        let lecture = map.get(row.LECTURE_ID);
        lecture.TAG.push(row.CATEGORY_TAG_NAME);
        map.set(row.LECTURE_ID, lecture);
    });
    let ref = Object.fromEntries(map);

    let resultRow = Object.values(ref);
    //console.log(resultRow);

    if(tagName){
        let tag;
        //console.log(tagName); // Java ,Back-End
        if(tagName){
            tag = tagName.split(',');
            //console.log(tag[0]); // Java
        }

        let reff = [];

        reff = resultRow.filter(function (v) {
            //console.log(v.TAG.includes(tag[0]))
            for(let i = 0;i < tag.length;i++){
                //console.log('1');
                if(v.TAG.includes(tag[i])){
                    return reff.push(v);
                }
            } // set 자료구조를 사용해서 filtering 해보자.
        });

        //console.log(reff);

        connection.release();

        return response(baseResponse.SUCCESS("강의 목록 조회에 성공 했습니다"),reff);
    }else{
        connection.release();

        return response(baseResponse.SUCCESS("강의 목록 조회에 성공 했습니다"),resultRow);
    }
}

exports.checkMiddleCategoryList = async function(bigCategoryName,middleCategoryName){
    const connection = await pool.getConnection(async (conn) => conn);
    const checkResult = await lectureDao.checkMiddleCategory(connection,bigCategoryName,middleCategoryName);
    console.log(checkResult);
    connection.release();

    return checkResult
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

exports.selectLectureInfo = async function(lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectLectureInfo = await lectureDao.selectLectureInfo(connection, lectureId);
    connection.release();

    return selectLectureInfo[0];
}
exports.selectReviewCreatedSort = async function(lectureId){
    const connection = await pool.getConnection(async (conn) => conn);
    const selectReviewRows = await lectureDao.selectReviewsCreatedSort(connection, lectureId);
    connection.release();

    return selectReviewRows;
}

exports.selectReviewHighGPA = async function(lectureId){
    const connection = await pool.getConnection(async (conn) => conn);
    const selectReviewRows = await lectureDao.selectReviewsHighGPA(connection, lectureId);
    connection.release();

    return selectReviewRows;
}

exports.selectReviewLowGPA = async function(lectureId){
    const connection = await pool.getConnection(async (conn) => conn);
    const selectReviewRows = await lectureDao.selectReviewsLowGPA(connection, lectureId);
    connection.release();

    return selectReviewRows;

}