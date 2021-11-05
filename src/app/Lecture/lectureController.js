const jwtMiddleware = require("../../../config/jwtMiddleware");
const lectureProvider = require("../../app/Lecture/lectureProvider");
const lectureService = require("../../app/Lecture/lectureService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const requestHandler = require("../../../config/requestHandler")
const regexEmail = require("regex-email");

/**
 * API No.
 * API Name : 강의 목록 조회 API
 * [GET] /inflearn/courses/lectures
 */
exports.getAllLectureList = async function(req,res){

    const lectureResult = await lectureProvider.getAllLectureList();

    return res.send(lectureResult);

}
/**
 * API No.
 * API Name : TOP 카테고리 별 강의 조회 API
 * [GET] /inflearn/courses/lectures/{topCategoryName}
 */
exports.getTopLectureList = async function(req,res){
    /**
     * Path Variable(타겟이 있는경우): topCategoryName
     */
    const topCategoryName = req.params.topCategoryName;

    if(!topCategoryName)
        return res.redirect('/inflearn/courses/lectures');

    const lectureResult = await lectureProvider.getLectureList(topCategoryName);

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

exports.getSessionClasses = async function(req, res) {
    const lectureId = req.params['lectureId'];

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const sessionClasses = await lectureService.getSessionClasses(lectureId);

    return res.send(sessionClasses);
}