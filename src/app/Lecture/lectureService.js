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
