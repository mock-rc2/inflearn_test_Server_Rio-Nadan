const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const lectureDao = require("./lectureDao");

exports.getLectureList = async function(){
    const connection = await pool.getConnection(async (conn)=>conn);

    const resultList = await lectureDao.selectLectureList(connection);
    const tagResult = await lectureDao.selectLectureTag(connection);
    console.log(tagResult);

    // for(let i= 0;)

    connection.release();

    return response(baseResponse.SUCCESS("강의정보 조회에 성공했습니다."),{resultList});
}