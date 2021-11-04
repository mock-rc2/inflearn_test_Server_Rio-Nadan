const jwtMiddleware = require("../../../config/jwtMiddleware");
const lectureProvider = require("../../app/Lecture/lectureProvider");
const lectureService = require("../../app/Lecture/lectureService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const requestHandler = require("../../../config/requestHandler")

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No.
 * API Name : 강의 목록 조회 API
 * [GET] /inflearn/courses/lectures
 */
exports.getAllLectureList = async function(req,res){

    const lectureResult = await lectureProvider.getLectureList();

    return res.send(lectureResult);

}