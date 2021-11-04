async function selectLectureList (connection){
    const lectureListQuery = `
    select distinct 
        LT.LECTURE_ID,LECTURE_NAME,TITLE_IMAGE,INTRO_BODY,STAR_POINT,SALE_PERCENT,
        PRICE,U.NICK_NAME,LEARNING_LEVEL,LTC.BIG_CATEGORY_NAME,
        LMC.MIDDLE_CATEGORY_NAME 
    from LECTURES
    inner join USERS U on LECTURES.USER_ID = U.USER_ID
    inner join LECTURE_TAGS LT on LECTURES.LECTURE_ID = LT.LECTURE_ID
    inner join LECTURE_TOP_CATEGORIES LTC on LT.BIG_CATEGORY_ID = LTC.BIG_CATEGORY_ID
    inner join LECTURE_MIDDLE_CATEGORIES LMC on LT.MIDDLE_CATEGORY_ID = LMC.MIDDLE_CATEGORY_ID;
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

module.exports = {
    selectLectureList,
    selectLectureTag
};