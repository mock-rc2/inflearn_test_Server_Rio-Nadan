
async function selectLectureList (connection){
    const lectureListQuery = `
    select distinct 
        LT.LECTURE_ID,LECTURE_NAME,TITLE_IMAGE,INTRO_BODY,STAR_POINT,
        SALE_PERCENT,PRICE,U.NICK_NAME,LEARNING_LEVEL,
        LTC.BIG_CATEGORY_NAME 
    from LECTURES
    inner join USERS U on LECTURES.USER_ID = U.USER_ID
    inner join LECTURE_TAGS LT on LECTURES.LECTURE_ID = LT.LECTURE_ID
    inner join LECTURE_TOP_CATEGORIES LTC on LT.BIG_CATEGORY_ID = LTC.BIG_CATEGORY_ID;
    `;

    const [lectureListResult] = await connection.query(lectureListQuery);
    return lectureListResult;
}

async function selectLectureTag(connection){
    const lectureTagQuery = `
    select  
        LT.LECTURE_ID,MCT.CATEGORY_TAG_NAME 
    from LECTURES
    inner join LECTURE_TAGS LT on LECTURES.LECTURE_ID = LT.LECTURE_ID
    inner join MIDDLE_CATEGORY_TAGS MCT on LT.CATEGORY_TAG_ID = MCT.CATEGORY_TAG_ID;
    `;

    const [lectureTagResult] = await connection.query(lectureTagQuery);

    return lectureTagResult;
}

async function selectLectureMiddle(connection){
    const lectureMiddleQuery = `
    select distinct 
        LECTURE_ID,LMC.MIDDLE_CATEGORY_NAME 
    from LECTURE_TAGS LT
    inner join LECTURE_MIDDLE_CATEGORIES LMC on LT.MIDDLE_CATEGORY_ID = LMC.MIDDLE_CATEGORY_ID
    order by LECTURE_ID asc;
    `;

    const [lectureMiddleResult] = await connection.query(lectureMiddleQuery);

    return lectureMiddleResult;
}

async function selectUserHaveLecture(connection, id, lectureId) {
    const selectUserHaveLectureQuery = `
        SELECT LECTURE_ID, USER_ID
        FROM USER_BUY_HISTORIES
        WHERE USER_ID = ? AND LECTURE_ID = ?;
  `;

    const [resultRow] = await connection.query(
        selectUserHaveLectureQuery,
        [id, lectureId]
    );
    return resultRow;
}

async function selectLecture(connection, lectureId) {
    const selectUserQuery = `
        SELECT LECTURE_ID, LECTURE_NAME
        FROM LECTURES
        WHERE LECTURE_ID = ?;
  `;
    const [resultRow] = await connection.query(
        selectUserQuery,
        lectureId
    );

    return resultRow;
}

async function selectLectureHeader(connection, lectureId) {
    const selectLectureHeaderQuery = `
        SELECT LEC.LECTURE_NAME, LEC.TITLE_IMAGE, LEC.STAR_POINT, U.NICK_NAME
        FROM LECTURES AS LEC
                 INNER JOIN USERS AS U
                            ON LEC.USER_ID = U.USER_ID
        WHERE LEC.LECTURE_ID = ?;
    `;

    const [resultRow] = await connection.query(
        selectLectureHeaderQuery,
        lectureId
    );

    return resultRow;
}

async function selectLectureStudentCount(connection, lectureId) {
    const selectLectureStudentCountQuery = `
        SELECT COUNT(USER_ID) AS STUDENTS_CNT
        FROM USER_CLASS_HISTORIES
        WHERE LECTURE_ID = ?;
    `;

    const [resultRow] = await connection.query(
        selectLectureStudentCountQuery,
        lectureId
    );

    return resultRow;
}

async function selectLecturePreviewCount(connection, lectureId) {
    const selectLecturePreviewCountQuery = `
        SELECT COUNT(CLASS_ID) AS PREVIEWS
        FROM LECTURE_CLASSES AS C 
            INNER JOIN LECTURE_SESSION AS S
                ON C.SESSION_ID = S.SESSION_ID
        WHERE S.LECTURE_ID = ? AND C.CLASS_ROLE_ID = 1;
    `;

    const [resultRow] = await connection.query(
        selectLecturePreviewCountQuery,
        lectureId
    );

    return resultRow;
}

async function selectLectureCategory(connection, lectureId) {
    const selectLectureCategoryQuery = `
    SELECT DISTINCT TOP_CT.BIG_CATEGORY_NAME, MIDDLE_CT.MIDDLE_CATEGORY_NAME
    FROM LECTURE_MIDDLE_CATEGORIES AS MIDDLE_CT 
        INNER JOIN LECTURE_TOP_CATEGORIES AS TOP_CT
            ON TOP_CT.BIG_CATEGORY_ID = MIDDLE_CT.MIDDLE_CATEGORY_ID
        INNER JOIN LECTURE_TAGS AS LECT_TAG
            ON LECT_TAG.BIG_CATEGORY_ID = TOP_CT.BIG_CATEGORY_ID
    WHERE LECT_TAG.LECTURE_ID = ?;
    `;

    const [resultRow] = await connection.query(
        selectLectureCategoryQuery,
        lectureId
    );

    return resultRow;
}

async function selectLectureTags(connection, lectureId) {
    const selectLectureTagQuery = `
        SELECT MIDDLE_TAG.CATEGORY_TAG_ID, MIDDLE_TAG.CATEGORY_TAG_NAME
        FROM MIDDLE_CATEGORY_TAGS AS MIDDLE_TAG
            INNER JOIN LECTURE_TAGS AS LECTURE_TAG
                ON MIDDLE_TAG.CATEGORY_TAG_ID = LECTURE_TAG.CATEGORY_TAG_ID
        WHERE LECTURE_TAG.LECTURE_ID = ?;
    `;

    const [lectureTagRows] = await connection.query(
        selectLectureTagQuery,
        lectureId
    );

    return lectureTagRows;
}


async function selectLectureIntroduction(connection, lectureId) {
    const selectIntroductionQuery = `
        SELECT INTRODUCTION
        FROM LECTURES
        WHERE LECTURE_ID = ?;
    `;

    const [lectureIntroductionRows] = await connection.query(
        selectIntroductionQuery,
        lectureId
    );

    return lectureIntroductionRows;
}

async function selectLectureSession(connection, lectureId) {
    const selectLectureSessionQuery = `
        SELECT SESSION_ID, SESSION_NAME, SESSION_TOTAL_TIME
        FROM LECTURE_SESSION
        WHERE LECTURE_ID = ?
    `;

    const [resultRows] = await connection.query(
        selectLectureSessionQuery,
        lectureId
    );

    return resultRows;
}

async function selectSessionClasses(connection, lectureId) {
    const selectSessionClassesQuery = `
        SELECT CLASS_ID, CLASS_NAME, CLASS_ROLE_ID, ROLE_DESCRIPTION
        FROM LECTURE_CLASSES
        WHERE SESSION_ID = ?;
    `;

    const [resultRows] = await connection.query(
        selectSessionClassesQuery,
        lectureId
    );

    return resultRows;
}

async function selectLectureReviews(connection, lectureId) {
    const selectLectureReviewQuery = `
        SELECT REVIEW.LECTURE_REVIEW_ID, USERS.NICK_NAME, REVIEW.STAR_POINT, REVIEW.REVIEW_COMMENT
                , USERS.PROFILE_IMAGE_URL, DATE_FORMAT(REVIEW.CREATED_AT, '%Y-%m-%d') AS CREATED_DATE
        FROM LECTURE_REVIEWS AS REVIEW 
            INNER JOIN USERS 
                ON REVIEW.USER_ID = USERS.USER_ID
        WHERE REVIEW.LECTURE_ID = ?;
    `;

    const [resultRows] = await connection.query(
        selectLectureReviewQuery,
        lectureId
    );

    return resultRows;
}

async function insertLectureReview(connection, reviewParams) {
    const insertLectureReview = `
        INSERT INTO LECTURE_REVIEWS(LECTURE_ID, USER_ID, STAR_POINT, REVIEW_COMMENT)
        VALUES (?, ?, ?, ?);
    `;

    const result = await connection.query(
        insertLectureReview,
        reviewParams
    );

    return result;
}

async function updateLectureReview(connection, starPoint, review, reviewId) {
    const updateLectureReviewQuery = `
        UPDATE LECTURE_REVIEWS
        SET STAR_POINT = ?, REVIEW_COMMENT = ?
        WHERE LECTURE_REVIEW_ID = ?;
    `;

    const updateLectureRows = await connection.query(
        updateLectureReviewQuery,
        [starPoint, review, reviewId]
    )

    return updateLectureRows;
}

async function selectUserLectureReview(connection, userId, reviewId) {
    const selectUserLectureReviewQuery = `
        SELECT LECTURE_REVIEW_ID
        FROM LECTURE_REVIEWS
        WHERE USER_ID = ? AND LECTURE_REVIEW_ID = ?;
    `;

    const [resultRows] = await connection.query(
        selectUserLectureReviewQuery,
        [userId, reviewId]
    );

    return resultRows;
}

async function deleteUserReview(connection, reviewId){
    const deleteUserReviewQuery = `
        DELETE FROM LECTURE_REVIEWS WHERE LECTURE_REVIEW_ID = ?;
    `;

    const deleteUserReviewResult = await connection.query(
        deleteUserReviewQuery,
        reviewId
    );

    return deleteUserReviewResult;
}

async function selectLectureNotice(connection, lectureId) {
    const selectLectureNoticeQuery = `
        SELECT NOTICE_ID, NOTICE_TITLE, NOTICE_CONTENT, DATE_FORMAT(CREATED_AT, '%Y-%m-%d') AS CREATED_DATE
        FROM LECTURE_NOTICE
        WHERE LECTURE_ID = ?
    `;

    const [selectUserLectureRows] = await connection.query(
        selectLectureNoticeQuery,
        lectureId
    );

    return selectUserLectureRows;
}

async function insertLectureNotice(connection, lectureNoticeParams) {
    const insertLectureNoticeQuery  = `
        INSERT INTO LECTURE_NOTICE(LECTURE_ID, USER_ID, NOTICE_TITLE, NOTICE_CONTENT) VALUES (?, ?, ?, ?);
    `;

    const insertLectureRow = await connection.query(
        insertLectureNoticeQuery,
        lectureNoticeParams
    )

    return insertLectureRow;
}

async function selectLectureUser(connection, userId, lectureId){
    const selectLectureUserQuery = `
        SELECT USER_ID
        FROM LECTURES
        WHERE USER_ID = ? AND LECTURE_ID = ?
    `;

    const [selectLectureUserResult] = await connection.query(
        selectLectureUserQuery,
        [userId, lectureId]
    );

    return selectLectureUserResult;
}

async function updateLectureNotice(connection, lectureNoticeParams) {
    const updateLectureQuery = `
        UPDATE LECTURE_NOTICE
        SET NOTICE_TITLE = ?, NOTICE_CONTENT = ?
        WHERE NOTICE_ID = ?;
    `;

    const updateLectureResult = await connection.query(
        updateLectureQuery,
        lectureNoticeParams
    )

    return updateLectureResult;
}

async function deleteLectureNotice(connection, noticeId) {
    const deleteNoticeQuery = `
        DELETE FROM LECTURE_NOTICE WHERE NOTICE_ID = ?;
    `;

    const deleteNoticeResult = await connection.query(
        deleteNoticeQuery,
        noticeId
    );

    return deleteNoticeResult;
}

async function selectLectureInfo(connection, lectureId) {
    const selectLectureInfoQuery = `
    SELECT L.PRICE, U.NICK_NAME, CLASS_INFO.CNT AS CLASS_COUNT, CLASS_INFO.LECTURE_TIME AS TOTAL_TIME, L.LEARNING_LEVEL
    FROM LECTURES AS L 
    INNER JOIN USERS AS U
        ON L.USER_ID = U.USER_ID
    INNER JOIN (SELECT S.LECTURE_ID AS LECTURE_ID, COUNT(C.CLASS_ID) AS CNT, 
            SEC_TO_TIME(SUM(TIME_TO_SEC(S.SESSION_TOTAL_TIME)))AS LECTURE_TIME
                FROM LECTURE_SESSION AS S
                    INNER JOIN LECTURE_CLASSES AS C
                        ON S.SESSION_ID = C.SESSION_ID
                GROUP BY S.LECTURE_ID) AS CLASS_INFO
        ON L.LECTURE_ID = CLASS_INFO.LECTURE_ID
    WHERE L.LECTURE_ID = ?;
    `;

    const [resultRow] = await connection.query(
        selectLectureInfoQuery,
        lectureId
    );

    return resultRow;
}

async function selectReviewsCreatedSort(connection, lectureId) {
    const selectReviewsCreatedSortQuery = `
        SELECT REVIEW.LECTURE_REVIEW_ID, USERS.NICK_NAME, REVIEW.STAR_POINT, REVIEW.REVIEW_COMMENT
                , USERS.PROFILE_IMAGE_URL, DATE_FORMAT(REVIEW.CREATED_AT, '%Y-%m-%d') AS CREATED_DATE
        FROM LECTURE_REVIEWS AS REVIEW 
            INNER JOIN USERS 
                ON REVIEW.USER_ID = USERS.USER_ID
        WHERE REVIEW.LECTURE_ID = ?
        ORDER BY REVIEW.CREATED_AT ASC;
    `;

    const [resultRows] = await connection.query(
        selectReviewsCreatedSortQuery,
        lectureId
    );

    return resultRows;
}

async function selectReviewsHighGPA(connection, lectureId) {
    const selectReviewsHighGPAQuery = `
        SELECT REVIEW.LECTURE_REVIEW_ID, USERS.NICK_NAME, REVIEW.STAR_POINT, REVIEW.REVIEW_COMMENT
                , USERS.PROFILE_IMAGE_URL, DATE_FORMAT(REVIEW.CREATED_AT, '%Y-%m-%d') AS CREATED_DATE
        FROM LECTURE_REVIEWS AS REVIEW 
            INNER JOIN USERS 
                ON REVIEW.USER_ID = USERS.USER_ID
        WHERE REVIEW.LECTURE_ID = ?
        ORDER BY REVIEW.STAR_POINT DESC;
    `;

    const [resultRows] = await connection.query(
        selectReviewsHighGPAQuery,
        lectureId
    );

    return resultRows;
}

async function selectReviewsLowGPA(connection, lectureId) {
    const selectReviewsLowGPAQuery = `
        SELECT REVIEW.LECTURE_REVIEW_ID, USERS.NICK_NAME, REVIEW.STAR_POINT, REVIEW.REVIEW_COMMENT
                , USERS.PROFILE_IMAGE_URL, DATE_FORMAT(REVIEW.CREATED_AT, '%Y-%m-%d') AS CREATED_DATE
        FROM LECTURE_REVIEWS AS REVIEW 
            INNER JOIN USERS 
                ON REVIEW.USER_ID = USERS.USER_ID
        WHERE REVIEW.LECTURE_ID = ?
        ORDER BY REVIEW.STAR_POINT ASC;
    `;

    const [resultRows] = await connection.query(
        selectReviewsLowGPAQuery,
        lectureId
    );

    return resultRows;
}

module.exports = {
    selectUserHaveLecture,
    selectLecture,
    selectLectureHeader,
    selectLectureStudentCount,
    selectLecturePreviewCount,
    selectLectureCategory,
    selectLectureTags,

    selectLectureIntroduction,
    selectLectureList,
    selectLectureTag,
    selectLectureMiddle,

    selectLectureSession,
    selectSessionClasses,
    selectLectureReviews,
    insertLectureReview,
    updateLectureReview,
    selectUserLectureReview,
    deleteUserReview,
    selectLectureNotice,
    insertLectureNotice,
    selectLectureUser,
    updateLectureNotice,
    deleteLectureNotice,
    selectLectureInfo,

    selectReviewsCreatedSort,
    selectReviewsHighGPA,
    selectReviewsLowGPA
};