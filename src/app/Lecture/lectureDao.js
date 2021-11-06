
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

async function selectLectureListWithTag(connection,tagString){
    const lectureListQueryWithTag = `
    select distinct 
        LT.LECTURE_ID,LECTURE_NAME,TITLE_IMAGE,INTRO_BODY,
        STAR_POINT,SALE_PERCENT,PRICE,U.NICK_NAME,
        LEARNING_LEVEL,LTC.BIG_CATEGORY_NAME 
    from LECTURES
    inner join USERS U on LECTURES.USER_ID = U.USER_ID
    inner join LECTURE_TAGS LT on LECTURES.LECTURE_ID = LT.LECTURE_ID
    inner join LECTURE_TOP_CATEGORIES LTC on LT.BIG_CATEGORY_ID = LTC.BIG_CATEGORY_ID
    inner join MIDDLE_CATEGORY_TAGS MCT on LT.CATEGORY_TAG_ID = MCT.CATEGORY_TAG_ID
        where ?;
    `;

    const [resultRow] = await connection.query(lectureListQueryWithTag,tagString);

    return resultRow;
}

async function selectTopLectureList(connection,topCategoryName){
    const topLectureListQuery = `
    select distinct 
        LT.LECTURE_ID,LECTURE_NAME,TITLE_IMAGE,INTRO_BODY,
        STAR_POINT,SALE_PERCENT,PRICE,U.NICK_NAME,LECTURE_NAME,
        LTC.BIG_CATEGORY_NAME 
    from LECTURES
    inner join USERS U on LECTURES.USER_ID = U.USER_ID
    inner join LECTURE_TAGS LT on LECTURES.LECTURE_ID = LT.LECTURE_ID
    inner join LECTURE_TOP_CATEGORIES LTC on LT.BIG_CATEGORY_ID = LTC.BIG_CATEGORY_ID
    where BIG_CATEGORY_NAME = ?;
    `;

    const [resultRows] = await connection.query(topLectureListQuery,topCategoryName);
    return resultRows;
}

async function selectLectureTag(connection){
    const lectureTagQuery = `
    select distinct
        LT.LECTURE_ID,MCT.CATEGORY_TAG_NAME 
    from LECTURES
    inner join LECTURE_TAGS LT on LECTURES.LECTURE_ID = LT.LECTURE_ID
    inner join MIDDLE_CATEGORY_TAGS MCT on LT.CATEGORY_TAG_ID = MCT.CATEGORY_TAG_ID;
    `;

    const [lectureTagResult] = await connection.query(lectureTagQuery);

    return lectureTagResult;
}

async function selectLectureTagWithTag(connection,tagString) {
    const lectureTagQueryWithTag = `
    
    `;
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

async function selectLectureMiddleWithTag(connection,tagString){
    const lectureMiddleQueryWithTag = `
    select distinct 
        LT.LECTURE_ID,LMC.MIDDLE_CATEGORY_NAME 
    from LECTURE_TAGS LT
    inner join LECTURE_MIDDLE_CATEGORIES LMC on LT.MIDDLE_CATEGORY_ID = LMC.MIDDLE_CATEGORY_ID
    inner join (select LECTURE_ID,CATEGORY_TAG_NAME from LECTURE_TAGS
    inner join MIDDLE_CATEGORY_TAGS MCT on LECTURE_TAGS.CATEGORY_TAG_ID = MCT.CATEGORY_TAG_ID) sub on sub.LECTURE_ID = LT.LECTURE_ID
        where CATEGORY_TAG_NAME = 'Java' or CATEGORY_TAG_NAME = 'Back-End'
        order by LECTURE_ID asc;
    `;

    const [resultRows] = await connection.query(lectureMiddleQueryWithTag,tagString);

    return resultRows;
}

async function selectTopLectureMiddle(connection,topCategoryName) {

    const lectureMiddleQuery = `
    select distinct
        LECTURE_ID,MIDDLE_CATEGORY_NAME 
    from LECTURE_TAGS
    inner join LECTURE_MIDDLE_CATEGORIES LMC on LECTURE_TAGS.MIDDLE_CATEGORY_ID = LMC.MIDDLE_CATEGORY_ID
    inner join LECTURE_TOP_CATEGORIES LTC on LECTURE_TAGS.BIG_CATEGORY_ID = LTC.BIG_CATEGORY_ID
        where BIG_CATEGORY_NAME = ?;
    `;

    const [resultRows] = await connection.query(lectureMiddleQuery,topCategoryName);
    return resultRows;

}

async function selectTopLectureTag(connection,topCategoryName) {
    const lectureTagQuery = `
    select distinct 
        LECTURE_ID, MCT.CATEGORY_TAG_NAME 
    from LECTURE_TAGS
    inner join MIDDLE_CATEGORY_TAGS MCT on LECTURE_TAGS.CATEGORY_TAG_ID = MCT.CATEGORY_TAG_ID
    inner join LECTURE_MIDDLE_CATEGORIES LMC on LECTURE_TAGS.MIDDLE_CATEGORY_ID = LMC.MIDDLE_CATEGORY_ID
    inner join LECTURE_TOP_CATEGORIES LTC on LECTURE_TAGS.BIG_CATEGORY_ID = LTC.BIG_CATEGORY_ID
        where BIG_CATEGORY_NAME = ?;
    `;

    const [resultRows] = await connection.query(lectureTagQuery,topCategoryName);

    return resultRows;
}

async function selectMiddleLectureList(connection,topCategoryName,middleCategoryName) {
    const topMiddleLectureQuery = `
    select distinct 
        LT.LECTURE_ID,LECTURE_NAME,TITLE_IMAGE,INTRO_BODY,
        STAR_POINT,SALE_PERCENT,PRICE,U.NICK_NAME,LECTURE_NAME,
        LTC.BIG_CATEGORY_NAME 
    from LECTURES
    inner join USERS U on LECTURES.USER_ID = U.USER_ID
    inner join LECTURE_TAGS LT on LECTURES.LECTURE_ID = LT.LECTURE_ID
    inner join LECTURE_MIDDLE_CATEGORIES LMC on LT.MIDDLE_CATEGORY_ID = LMC.MIDDLE_CATEGORY_ID
    inner join LECTURE_TOP_CATEGORIES LTC on LT.BIG_CATEGORY_ID = LTC.BIG_CATEGORY_ID
        where BIG_CATEGORY_NAME = ? AND MIDDLE_CATEGORY_NAME = ?;
    `;

    const [resultRows] = await connection.query(topMiddleLectureQuery,[topCategoryName,middleCategoryName]);
    return resultRows;
}

async function selectMiddleLecture(connection,topCategoryName,middleCategoryName) {
    const middleLectureQuery =`
    select distinct 
        LT.LECTURE_ID,MIDDLE_CATEGORY_NAME 
    from LECTURE_TAGS LT
    inner join LECTURE_TOP_CATEGORIES LTC on LT.BIG_CATEGORY_ID = LTC.BIG_CATEGORY_ID
    inner join LECTURE_MIDDLE_CATEGORIES LMC on LT.MIDDLE_CATEGORY_ID = LMC.MIDDLE_CATEGORY_ID
        where BIG_CATEGORY_NAME = ? AND MIDDLE_CATEGORY_NAME = ?;
    `;
    const [resultRows] = await connection.query(
        middleLectureQuery,
        [topCategoryName,middleCategoryName]
    );
    return resultRows;
}

async function selectMiddleLectureTag(connection,topCategoryName,middleCategoryName) {
    const tagLectureQuery = `
    
    `;
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

    selectTopLectureList,
    selectTopLectureMiddle,
    selectTopLectureTag,
    selectMiddleLectureList,
    selectMiddleLecture,

    selectLectureReviews,
    insertLectureReview,
    updateLectureReview,
    selectUserLectureReview,
    deleteUserReview

};