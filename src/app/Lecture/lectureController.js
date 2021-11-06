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
    /**
     * Query String: tagName
     */
    const tagName = req.query.skill;
    console.log(tagName);

    const lectureResult = await lectureProvider.getAllLectureList(tagName);

    return res.send(response(baseResponse.SUCCESS("강의 목록 조회에 성공하였습니다"),lectureResult));

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

/**
 * API No.
 * API Name : TOP 카테고리 별 강의 조회 API
 * [GET] /inflearn/courses/lectures/{topCategoryName}/{middleCategoryName}
 */
exports.getMiddleLectureList = async function(req,res){
    /**
     * Path Variable(타겟이 있는경우): topCategoryName,middleCategoryName
     */
    const topCategoryName = req.params.topCategoryName;
    const middleCategoryName = req.params.middleCategoryName;

    if(!topCategoryName)
        return res.redirect('/inflearn/courses/lectures');
    else if(!middleCategoryName)
        return res.redirect('/inflearn/courses/lectures/:topCategoryName')

    const lectureResult = await lectureProvider.getMiddleLectureList(topCategoryName,middleCategoryName);

    return res.send(lectureResult);
}

exports.getUserLecture = async function(req, res) {
    const token = req.verifiedToken;

    const userId = token.userId;

    const lectureId = req.params['lectureId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_REVIEW_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const getUserLecture = await lectureService.userLectureCheck(userId, lectureId);

    return res.send(getUserLecture);
}

exports.getLectureHeaderItems = async function(req, res) {
    const lectureId = req.params['lectureId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_REVIEW_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const getUserLectureHeaderResult = await lectureService.getLectureHeader(lectureId);

    return res.send(getUserLectureHeaderResult);
}

exports.getLectureIntroduction = async function(req, res) {
    const lectureId = req.params['lectureId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_REVIEW_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const lectureIntroduction = await lectureProvider.selectLectureIntroduction(lectureId);

    if(!lectureIntroduction) return res.send(errResponse(baseResponse.GET_LECTURE_INTRODUCTION_FAIL));

    return res.send(response(baseResponse.SUCCESS("강의 소개 조회 성공"), lectureIntroduction));
}

exports.getSessionClasses = async function(req, res) {
    const lectureId = req.params['lectureId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_REVIEW_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const sessionClasses = await lectureService.getSessionClasses(lectureId);

    return res.send(sessionClasses);
}

exports.getLectureReviews = async function(req, res) {
    const lectureId = req.params['lectureId'];

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_REVIEW_EMPTY));

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const lectureReviews = await lectureProvider.selectLectureReviews(lectureId);

    return res.send(response(baseResponse.SUCCESS("강의 리뷰 조회 성공"), lectureReviews));
}

exports.postLectureReview = async function(req, res) {
    const token = req.verifiedToken;
    const lectureId = req.params['lectureId'];
    const userId = token.userId;
    const {starPoint, review} = req.body;

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(!review)
        return res.send(errResponse(baseResponse.LECTURE_REVIEW_EMPTY));

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const checkUserLecture = await lectureProvider.checkUserLecture(userId, lectureId);

    if(checkUserLecture.length < 1)
        return res.send(errResponse(baseResponse.CHECK_USER_LECTURES_FAIL));

    const insertReviewResult = await lectureService.postLectureReview(lectureId, userId, starPoint, review);

    return res.send(insertReviewResult);
}

exports.putLectureReview = async function(req, res) {
    const lectureId = req.params['lectureId'];
    const token = req.verifiedToken;
    const reviewId = req.params['reviewId'];
    const userId = token.userId;
    const {starPoint, review} = req.body;

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(!review)
        return res.send(errResponse(baseResponse.LECTURE_REVIEW_EMPTY));

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const checkUserReviewRow = await lectureProvider.checkUserLectureReview(userId, reviewId);

    if(checkUserReviewRow.length < 1)
        return res.send(errResponse(baseResponse.USER_REVIEW_NOT_EXIST));

    const updateReviewResult = await lectureService.putLectureReview(starPoint, review, reviewId);

    return  res.send(updateReviewResult);
}

exports.deleteLectureReview = async function(req, res) {
    const lectureId = req.params['lectureId'];
    const token = req.verifiedToken;
    const reviewId = req.params['reviewId'];
    const userId = token.userId;

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_REVIEW_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    const checkUserReviewRow = await lectureProvider.checkUserLectureReview(userId, reviewId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    if(checkUserReviewRow.length < 1)
        return res.send(errResponse(baseResponse.USER_REVIEW_NOT_EXIST));

    const deleteReviewResult = await lectureService.deleteLectureReview(reviewId);

    return  res.send(deleteReviewResult);
}