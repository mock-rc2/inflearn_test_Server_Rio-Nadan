const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const lectureProvider = require("./lectureProvider");
const lectureDao = require("./lectureDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const {checkUserLecture} = require("./lectureProvider");

exports.userLectureCheck = async function (id, lectureId) {
    try{
        const userLectureRow = await lectureProvider.checkUserLecture(id, lectureId);

        if(userLectureRow.length < 1) return errResponse(baseResponse.CHECK_USER_LECTURES_FAIL);

        return response(baseResponse.SUCCESS("강의를 소유하고 있습니다."));
    } catch (err) {
        logger.error(`App - userLectureCheck Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }
}

exports.getLectureHeader = async function(lectureId) {
    try{
        let lectureHeaderRows = await lectureProvider.selectLectureHeader(lectureId);

        lectureHeaderRows.studentCount = await lectureProvider.selectLectureStudentCount(lectureId);

        lectureHeaderRows.previewCount = await lectureProvider.selectLecturePreviewCount(lectureId);

        lectureHeaderRows.category = await lectureProvider.selectLectureCategory(lectureId);

        lectureHeaderRows.tags = await lectureProvider.selectLectureTags(lectureId);

        return response(baseResponse.SUCCESS("강의 헤더 조회 성공"), lectureHeaderRows);
    } catch (err) {
        logger.error(`App - lectureHeader Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }
}

exports.getSessionClasses = async function (lectureId) {
    try{
        let sessionRows = await lectureProvider.selectLectureSessions(lectureId);

        if(!sessionRows) return errResponse(baseResponse.GET_LECTURE_SESSION_FAIL);

        for(let i = 0; i<sessionRows.length; i++) {
            sessionRows[i].CLASS = await lectureProvider.selectSessionClasses(sessionRows[i].SESSION_ID);
        }

        return response(baseResponse.SUCCESS("강의 세션의 클래스 조회 성공"), sessionRows);
    } catch (err) {
        logger.error(`App - getSessionClasses Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }
}

exports.postLectureReview = async function(lectureId, userId, starPoint, review) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const reviewParams = [lectureId, userId, starPoint, review];

        const insertReviewResult = await lectureDao.insertLectureReview(connection, reviewParams);

        // 업데이트 검증
        if (insertReviewResult.affectedRows == 0) {
            await connection.rollback();
            return errResponse(baseResponse.INSERT_LECTURE_REVIEW_FAIL);
        }

        return response(baseResponse.SUCCESS("리뷰 작성 성공"));
    }catch (err){
        await connection.rollback();
        logger.error(`App - postLectureReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    } finally {
        connection.release();
    }
}

exports.putLectureReview = async function(starPoint, review, reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const reviewUpdateResult = await lectureDao.updateLectureReview(connection, starPoint, review, reviewId);

        if(reviewUpdateResult.affectedRows == 0){
            await connection.rollback();
            return errResponse(baseResponse.UPDATE_LECTURE_REVIEW_FAIL);
        }

        return response(baseResponse.SUCCESS("리뷰 수정 성공"));
    }catch (err){
        await connection.rollback();
        logger.error(`App - putLectureReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    } finally {
        connection.release();
    }
}

exports.deleteLectureReview = async function(reviewId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const reviewDeleteResult = await lectureDao.deleteUserReview(connection, reviewId);

        if(reviewDeleteResult.affectedRows == 0){
            await connection.rollback();
            return errResponse(baseResponse.DELETE_LECTURE_REVIEW_FAIL);
        }

        return response(baseResponse.SUCCESS("리뷰 삭제 성공"));
    }catch (err){
        await connection.rollback();
        logger.error(`App - deleteLectureReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    } finally {
        connection.release();
    }
}

exports.insertLectureNotice = async function(lectureId, userId, noticeTitle, noticeContent) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const userCheckResult = await lectureProvider.checkLectureUser(userId, lectureId);

        if(userCheckResult.length < 1)
            return errResponse(baseResponse.DONT_HAVE_PERMISSION);

        const insertNoticeParam = [lectureId, userId, noticeTitle, noticeContent];

        const insertNoticeResult = await lectureDao.insertLectureNotice(connection, insertNoticeParam);

        if(insertNoticeResult.affectedRows == 0){
            await connection.rollback();
            return errResponse(baseResponse.INSERT_LECTURE_NOTICE_FAIL);
        }

        return response(baseResponse.SUCCESS("강의 공지 작성을 성공하였습니다."));
    } catch (err){
        await connection.rollback();
        logger.error(`App - insertLectureNotice Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}

exports.updateLectureNotice = async function(userId, lectureId, noticeId, noticeTitle, noticeContent) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const userCheckResult = await lectureProvider.checkLectureUser(userId, lectureId);

        if(userCheckResult.length < 1)
            return errResponse(baseResponse.DONT_HAVE_PERMISSION);

        const updateNoticeParam = [noticeTitle, noticeContent, noticeId];

        const updateNoticeResult = await lectureDao.updateLectureNotice(connection, updateNoticeParam);

        if(updateNoticeResult.affectedRows == 0){
            await connection.rollback();
            return errResponse(baseResponse.UPDATE_LECTURE_NOTICE_FAIL);
        }

        return response(baseResponse.SUCCESS("강의 공지 수정을 성공하였습니다."));
    }catch (err){
        await connection.rollback();
        logger.error(`App - updateLectureNotice Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}

exports.deleteLectureNotice = async function(userId, lectureId, noticeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const userCheckResult = await lectureProvider.checkLectureUser(userId, lectureId);

        if(userCheckResult.length < 1)
            return errResponse(baseResponse.DONT_HAVE_PERMISSION);

        const deleteNoticeResult = await lectureDao.deleteLectureNotice(connection, noticeId);

        if(deleteNoticeResult.affectedRows == 0){
            await connection.rollback();
            return errResponse(baseResponse.DELETE_LECTURE_NOTICE_FAIL);
        }

        return response(baseResponse.SUCCESS("강의 공지 삭제를 성공하였습니다."));
    }catch (err){
        await connection.rollback();
        logger.error(`App - deleteLectureNotice Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }finally {
        connection.release();
    }
}

