const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const userDao = require("../User/userDao");
const lectureDao = require("./lectureDao");
const lectureProvider = require("./lectureProvider");
const {query} = require("winston");
const communityDao = require("../Community/communityDao");

exports.getFilterLectureList = async function(tagRow) {
    const connection = await pool.getConnection(async (conn)=>conn);

    try{
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

            return lectureResultFilter;

        }else{

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

            return lectureResult;
        }

    }finally {
        connection.release();
    }
}

exports.checkBigCategoryList = async function(bigCategoryName){
    const connection = await pool.getConnection(async (conn)=>conn);
    const checkResult = await lectureDao.checkBigCategory(connection,bigCategoryName);

    connection.release();

    return checkResult;
}

exports.getLectureList = async function(bigCategoryName,tagRow) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
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

            return lectureResultFilter;

        }else{

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

            return lectureResult;
        }

    }finally {
        connection.release();
    }
}

exports.getMiddleLectureList = async function(bigCategoryName,middleCategoryName,tagRow) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        if (tagRow) {
            let tags = tagRow.split(',');
            let where = await lectureDao.buildQuery(tags);


            const lectureResultFilter = await lectureDao.filterMiddleLectureList(connection, bigCategoryName, middleCategoryName, where);


            for (const row of lectureResultFilter) {
                row.MIDDLE_CATEGORY_NAME = [];
                row.TAG = [];
                const middleResult = await lectureDao.selectLectureMiddle(connection, row.LECTURE_ID);
                await middleResult.forEach((m) => {
                    row.MIDDLE_CATEGORY_NAME.push(m.MIDDLE_CATEGORY_NAME);
                });

                const tagResult = await lectureDao.selectLectureTag(connection, row.LECTURE_ID);
                await tagResult.forEach((t) => {
                    row.TAG.push(t.CATEGORY_TAG_NAME);
                })
            }

            return lectureResultFilter;

        } else {
            const lectureResult = await lectureDao.selectMiddleLectureList(connection, bigCategoryName, middleCategoryName);

            for (const row of lectureResult) {
                row.MIDDLE_CATEGORY_NAME = [];
                row.TAG = [];


                const middleResult = await lectureDao.selectLectureMiddle(connection, row.LECTURE_ID);
                await middleResult.forEach((m) => {
                    row.MIDDLE_CATEGORY_NAME.push(m.MIDDLE_CATEGORY_NAME);
                });

                const tagResult = await lectureDao.selectLectureTag(connection, row.LECTURE_ID);
                await tagResult.forEach((t) => {
                    row.TAG.push(t.CATEGORY_TAG_NAME);
                })
            }
            return lectureResult;
        }
    } finally {
        connection.release();
    }
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
    try{
        const selectStudentCountRow = await lectureDao.selectLectureStudentCount(connection, lectureId);

        if (!selectStudentCountRow) return 0;

        return selectStudentCountRow[0].STUDENTS_CNT;
    }finally {
        connection.release();
    }
}

exports.selectLecturePreviewCount = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const selectPreviewCount = await lectureDao.selectLecturePreviewCount(connection, lectureId);

        if (!selectPreviewCount) return 0;

        return selectPreviewCount[0].PREVIEWS;
    }finally {
        connection.release();
    }

}
exports.selectLectureCategory = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const selectLectureTagRows = await lectureDao.selectLectureCategory(connection, lectureId);

        if (!selectLectureTagRows) return [];

        return selectLectureTagRows[0];
    }finally {
        connection.release();
    }
}


exports.selectLectureTags = async function (lectureId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const selectLectureTagRows = await lectureDao.selectLectureTags(connection, lectureId);

        if (!selectLectureTagRows) return [];

        return selectLectureTagRows;
    } finally {
        connection.release();
    }
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
        try{
            const selectClasses = await lectureDao.selectSessionClasses(connection, sessionId);

            if(!selectClasses) return [];

            return selectClasses;
        }finally {
            connection.release();
        }
    }


    exports.selectLectureReviews = async function (lectureId) {
        const connection =  await pool.getConnection(async (conn) => conn);
        try{
            const selectReviews = await lectureDao.selectLectureReviews(connection, lectureId);

            if(!selectReviews) return [];

            return selectReviews;
        }finally {
            connection.release();
        }
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

exports.getDashboardHeader = async function(lectureId,userId){
    const connection = await pool.getConnection(async (conn)=>conn);
        try{
            const checkLectureRow = await lectureProvider.checkLecture(lectureId);

            if(checkLectureRow.length < 1)
                return errResponse(baseResponse.LECTURE_NOT_EXISTENCE);

            const checkUserLecture = await lectureProvider.checkUserLecture(userId, lectureId);

            if(checkUserLecture.length < 1)
                return errResponse(baseResponse.CHECK_USER_LECTURES_FAIL);

            let lectureHeaderRows = await lectureProvider.selectLectureHeader(lectureId);

            lectureHeaderRows.studentCount = await lectureProvider.selectLectureStudentCount(lectureId);

            lectureHeaderRows.previewCount = await lectureProvider.selectLecturePreviewCount(lectureId);

            lectureHeaderRows.category = await lectureProvider.selectLectureCategory(lectureId);

            lectureHeaderRows.tags = await lectureProvider.selectLectureTags(lectureId);

            lectureHeaderRows.lectureProgress = await lectureDao.selectProgress(connection,lectureId,userId);

            let allClassCnt = lectureHeaderRows.lectureProgress[0].allCnt;
            let completeClassCnt = lectureHeaderRows.lectureProgress[0].completeCnt;
            let progressRate = ((completeClassCnt/allClassCnt)*100).toFixed(2);

            lectureHeaderRows.lectureProgress = [{'allClassCnt' :allClassCnt,'completeClassCnt' :completeClassCnt,'progressRate' :progressRate + '%'}];

            return response(baseResponse.SUCCESS("헤더 정보를 가져왔습니다"),lectureHeaderRows);
        }finally {
            connection.release();
        }
    }

exports.getDashboardQuestionCnt = async function(lectureId,userId){
    const connection = await pool.getConnection(async (conn)=>conn);
        try{
            const checkLectureRow = await lectureProvider.checkLecture(lectureId);

            if(checkLectureRow.length < 1)
                return errResponse(baseResponse.LECTURE_NOT_EXISTENCE);

            const checkUserLecture = await lectureProvider.checkUserLecture(userId, lectureId);

            if(checkUserLecture.length < 1)
                return errResponse(baseResponse.CHECK_USER_LECTURES_FAIL);

            const getQuestionCnt = await lectureDao.selectQuestionList(connection,lectureId);

            return response(baseResponse.SUCCESS("질문 목록 조회에 성공하였습니다"),getQuestionCnt);
        }finally {
            connection.release();
        }
    }

exports.getDashboardCurriculum = async function(lectureId,userId){

    const connection = await pool.getConnection(async (conn)=>conn);
        try{
            const checkLectureRow = await lectureProvider.checkLecture(lectureId);

            if(checkLectureRow.length < 1)
                return errResponse(baseResponse.LECTURE_NOT_EXISTENCE);

            const checkUserLecture = await lectureProvider.checkUserLecture(userId, lectureId);

            if(checkUserLecture.length < 1)
                return errResponse(baseResponse.CHECK_USER_LECTURES_FAIL);

            let sessionRows = await lectureProvider.selectLectureSessions(lectureId);

            if(!sessionRows)
                return errResponse(baseResponse.GET_LECTURE_SESSION_FAIL);

            for(let i = 0; i<sessionRows.length; i++) {
                sessionRows[i].CLASS = await lectureDao.selectLectureCurriculum(connection,sessionRows[i].SESSION_ID);
            }

            return response(baseResponse.SUCCESS("강의 세션 목록 조회에 성공하였습니다"),sessionRows)
        }finally {
            connection.release();
        }

}

exports.getUserHistories = async function(userId) {
    const connection = await pool.getConnection(async (conn)=>conn);

        const userHistoriesResult = await lectureDao.selectUserHistories(connection, userId);

    return userHistoriesResult;
}

exports.getLectureLateASC = async function() {
    const connection = await pool.getConnection(async (conn)=>conn);

    const result = await lectureDao.selectLectureLateASC(connection);

    connection.release();

    return result;
}

exports.getLecturePopular = async function() {
    const connection = await pool.getConnection(async (conn)=>conn);

    const result = await lectureDao.selectLecturePopularDESC(connection);

    connection.release();

    return result;

}