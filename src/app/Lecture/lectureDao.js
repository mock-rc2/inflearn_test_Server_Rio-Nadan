
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
    const selectLectureTagsQuery = `
        SELECT MIDDLE_TAG.CATEGORY_TAG_ID, MIDDLE_TAG.CATEGORY_TAG_NAME
        FROM MIDDLE_CATEGORY_TAGS AS MIDDLE_TAG
            INNER JOIN LECTURE_TAGS AS LECTURE_TAG
                ON MIDDLE_TAG.CATEGORY_TAG_ID = LECTURE_TAG.CATEGORY_TAG_ID
        WHERE LECTURE_TAG.LECTURE_ID = ?;
    `;

    const [lectureTagRows] = await connection.query(
        selectLectureTagsQuery,
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

module.exports = {
    selectUserHaveLecture,
    selectLecture,
    selectLectureHeader,
    selectLectureStudentCount,
    selectLecturePreviewCount,
    selectLectureCategory,
    selectLectureTags,
    selectLectureIntroduction,
    selectLectureMiddle,
    selectLectureTag,
    selectLectureMiddle
};