const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const userDao = require("../User/userDao");
const lectureDao = require("./lectureDao");
const {query} = require("winston");

exports.getFilterLectureList = async function(tagRow) {
    const connection = await pool.getConnection(async (conn)=>conn);

    if(tagRow){
        let tags = tagRow.split(',');
        let where = await lectureDao.buildQuery(tags);


        const lectureResultFilter = await lectureDao.filterLectureList(connection,where);


        for (const row of lectureResultFilter) {
            row.MIDDLE_CATEGORY_NAME = [];
            row.TAG = [];

            const middleResult = await lectureDao.selectLectureMiddle(connection,row.LECTURE_ID);
            await middleResult.forEach((m) => {
                row.MIDDLE_CATEGORY_NAME.push(m.MIDDLE_CATEGORY_NAME);
            });

            const tagResult = await lectureDao.selectLectureTag(connection,row.LECTURE_ID);
            await tagResult.forEach((t)=>{
                row.TAG.push(t.CATEGORY_TAG_NAME);
            })
        }


        connection.release;

        return lectureResultFilter;

    }

    const lectureResult = await lectureDao.selectLectureList(connection);

    for (const row of lectureResult) {
        row.MIDDLE_CATEGORY_NAME = [];
        row.TAG = [];

        const middleResult = await lectureDao.selectLectureMiddle(connection,row.LECTURE_ID);
        await middleResult.forEach((m) => {
            row.MIDDLE_CATEGORY_NAME.push(m.MIDDLE_CATEGORY_NAME);
        });

        const tagResult = await lectureDao.selectLectureTag(connection,row.LECTURE_ID);
        await tagResult.forEach((t)=>{
            row.TAG.push(t.CATEGORY_TAG_NAME);
        })
    }

    connection.release();

    return lectureResult;
}

exports.checkBigCategoryList = async function(bigCategoryName){
    const connection = await pool.getConnection(async (conn)=>conn);
    const checkResult = await lectureDao.checkBigCategory(connection,bigCategoryName);

    connection.release();

    return checkResult;
}

exports.getLectureList = async function(bigCategoryName,tagRow) {

    const connection = await pool.getConnection(async (conn) => conn);

    if(tagRow){
        let tags = tagRow.split(',');
        let where = await lectureDao.buildQuery(tags);

        const lectureResultFilter = await lectureDao.filterBigLectureList(connection,bigCategoryName,where);

        for (const row of lectureResultFilter) {
            row.MIDDLE_CATEGORY_NAME = [];
            row.TAG = [];

            const middleResult = await lectureDao.selectLectureMiddle(connection,row.LECTURE_ID);
            await middleResult.forEach((m) => {
                row.MIDDLE_CATEGORY_NAME.push(m.MIDDLE_CATEGORY_NAME);
            });

            const tagResult = await lectureDao.selectLectureTag(connection,row.LECTURE_ID);
            await tagResult.forEach((t)=>{
                row.TAG.push(t.CATEGORY_TAG_NAME);
            })
        }

        connection.release;

        return lectureResultFilter;

    }

    const lectureResult = await lectureDao.selectTopLectureList(connection,bigCategoryName);

    for (const row of lectureResult) {
        row.MIDDLE_CATEGORY_NAME = [];
        row.TAG = [];

        const middleResult = await lectureDao.selectLectureMiddle(connection,row.LECTURE_ID);
        await middleResult.forEach((m) => {
            row.MIDDLE_CATEGORY_NAME.push(m.MIDDLE_CATEGORY_NAME);
        });

        const tagResult = await lectureDao.selectLectureTag(connection,row.LECTURE_ID);
        await tagResult.forEach((t)=>{
            row.TAG.push(t.CATEGORY_TAG_NAME);
        })
    }

    connection.release();

    return lectureResult;

}

exports.getMiddleLectureList = async function(bigCategoryName,middleCategoryName,tagRow){

    const connection = await pool.getConnection(async (conn)=>conn);

    if(tagRow){
        let tags = tagRow.split(',');
        let where = await lectureDao.buildQuery(tags);


        const lectureResultFilter = await lectureDao.filterMiddleLectureList(connection,bigCategoryName,middleCategoryName,where);


        for (const row of lectureResultFilter) {
            row.MIDDLE_CATEGORY_NAME = [];
            row.TAG = [];
            const middleResult = await lectureDao.selectLectureMiddle(connection,row.LECTURE_ID);
            await middleResult.forEach((m) => {
                row.MIDDLE_CATEGORY_NAME.push(m.MIDDLE_CATEGORY_NAME);
            });

            const tagResult = await lectureDao.selectLectureTag(connection,row.LECTURE_ID);
            await tagResult.forEach((t)=>{
                row.TAG.push(t.CATEGORY_TAG_NAME);
            })
        }

        connection.release;

        return lectureResultFilter;

    }

    const lectureResult = await lectureDao.selectMiddleLectureList(connection,bigCategoryName,middleCategoryName);

    for (const row of lectureResult) {
        row.MIDDLE_CATEGORY_NAME = [];
        row.TAG = [];


        const middleResult = await lectureDao.selectLectureMiddle(connection,row.LECTURE_ID);
        await middleResult.forEach((m) => {
            row.MIDDLE_CATEGORY_NAME.push(m.MIDDLE_CATEGORY_NAME);
        });

        const tagResult = await lectureDao.selectLectureTag(connection,row.LECTURE_ID);
        await tagResult.forEach((t)=>{
            row.TAG.push(t.CATEGORY_TAG_NAME);
        })
    }

    connection.release();

    return lectureResult;
}

exports.checkMiddleCategoryList = async function(bigCategoryName,middleCategoryName){
    const connection = await pool.getConnection(async (conn) => conn);
    const checkResult = await lectureDao.checkMiddleCategory(connection,bigCategoryName,middleCategoryName);
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