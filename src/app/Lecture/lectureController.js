const jwtMiddleware = require("../../../config/jwtMiddleware");
const lectureProvider = require("../../app/Lecture/lectureProvider");
const lectureService = require("../../app/Lecture/lectureService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const requestHandler = require("../../../config/requestHandler")

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const {getUserLecture} = require("./lectureController");

/**
 * API No.
 * API Name : 강의 목록 조회 API
 * [GET] /inflearn/courses/lectures
 */
exports.getAllLectureList = async function(req,res){

    const lectureResult = await lectureProvider.getLectureList();

    return res.send(lectureResult);

}

exports.getUserLecture = async function(req, res) {
    const token = req.verifiedToken;

    const userId = token.userId;

    const lectureId = req.params['lectureId'];

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const getUserLecture = await lectureService.userLectureCheck(userId, lectureId);

    return res.send(getUserLecture);
}

exports.getLectureHeaderItems = async function(req, res) {
    const lectureId = req.params['lectureId'];

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const getUserLectureHeaderResult = await lectureService.getLectureHeader(lectureId);

    return res.send(getUserLectureHeaderResult);
}

exports.getLectureIntroduction = async function(req, res) {
    const lectureId = req.params['lectureId'];

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const lectureIntroduction = await lectureProvider.selectLectureIntroduction(lectureId);

    if(!lectureIntroduction) return res.send(errResponse(baseResponse.GET_LECTURE_INTRODUCTION_FAIL));

    return res.send(response(baseResponse.SUCCESS("강의 소개 조회 성공"), lectureIntroduction));
}