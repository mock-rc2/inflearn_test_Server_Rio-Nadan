const lectureProvider = require("../../app/Lecture/lectureProvider");
const lectureService = require("../../app/Lecture/lectureService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


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

    const lectureResult = await lectureProvider.getFilterLectureList(tagName);

    return res.send(response(baseResponse.SUCCESS("강의 목록 조회에 성공하였습니다"),lectureResult));

}
/**
 * API No.
 * API Name : TOP 카테고리 별 강의 조회 API
 * [GET] /inflearn/courses/lectures/{bigCategoryName}
 */
exports.getBigLectureList = async function(req,res){
    /**
     * Path Variable(타겟이 있는경우): bigCategoryName
     * Query String : tagName
     */
    const bigCategoryName = req.params.bigCategoryName;
    const tagName = req.query.skill;

    if(!bigCategoryName)
        return res.redirect('/inflearn/courses/lectures');

    const isExist = await lectureProvider.checkBigCategoryList(bigCategoryName);

    if(isExist.length < 1)
        return res.send(errResponse(baseResponse.CATEGORY_NOT_EXIST));

    const lectureResult = await lectureProvider.getLectureList(bigCategoryName,tagName);

    return res.send(response(baseResponse.SUCCESS("강의 목록 조회에 성공하였습니다"),lectureResult));
}

/**
 * API No.
 * API Name : middle 카테고리 별 강의 조회 API
 * [GET] /inflearn/courses/lectures/{bigCategoryName}/{middleCategoryName}
 */
exports.getMiddleLectureList = async function(req,res){
    /**
     * Path Variable(타겟이 있는경우): bigCategoryName,middleCategoryName
     * Query String : tagName
     */
    const bigCategoryName = req.params.bigCategoryName;
    const middleCategoryName = req.params.middleCategoryName;

    const tagName = req.query.skill;

    if(!bigCategoryName)
        return res.redirect('/inflearn/courses/lectures');
    else if(!middleCategoryName)
        return res.redirect('/inflearn/courses/lectures/:bigCategoryName')

    const isExist = await lectureProvider.checkMiddleCategoryList(bigCategoryName,middleCategoryName);

    if(isExist.length < 1)
        return res.send(errResponse(baseResponse.CATEGORY_NOT_EXIST));

    const lectureResult = await lectureProvider.getMiddleLectureList(bigCategoryName,middleCategoryName,tagName);

    return res.send(response(baseResponse.SUCCESS("강의 목록 조회에 성공하였습니다"),lectureResult));
}

exports.getUserLecture = async function(req, res) {
    const token = req.verifiedToken;

    const userId = token.userId;

    const lectureId = req.params['lectureId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const getUserLecture = await lectureService.userLectureCheck(userId, lectureId);

    return res.send(getUserLecture);
}

exports.getLectureHeaderItems = async function(req, res) {
    const lectureId = req.params['lectureId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));


    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const getUserLectureHeaderResult = await lectureService.getLectureHeader(lectureId);

    return res.send(getUserLectureHeaderResult);
}

exports.getLectureIntroduction = async function(req, res) {
    const lectureId = req.params['lectureId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));


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
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));


    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const sessionClasses = await lectureService.getSessionClasses(lectureId);

    return res.send(sessionClasses);
}

exports.getLectureReviews = async function(req, res) {
    const lectureId = req.params['lectureId'];

    const sortQuery = req.query.sort;
    let lectureReviews;

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));


    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    if(!sortQuery){
        lectureReviews = await lectureProvider.selectLectureReviews(lectureId);
    }else {
        switch (sortQuery) {
            case 'created':
                lectureReviews = await lectureProvider.selectReviewCreatedSort(lectureId);
                break;

            case 'highGPA':
                lectureReviews = await lectureProvider.selectReviewHighGPA(lectureId);
                break;

            case 'lowGPA':
                lectureReviews = await lectureProvider.selectReviewLowGPA(lectureId);
                break;
        }
    }

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
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));


    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    const checkUserReviewRow = await lectureProvider.checkUserLectureReview(userId, reviewId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    if(checkUserReviewRow.length < 1)
        return res.send(errResponse(baseResponse.USER_REVIEW_NOT_EXIST));

    const deleteReviewResult = await lectureService.deleteLectureReview(reviewId);

    return  res.send(deleteReviewResult);


}

exports.getLectureNotice = async function(req, res) {
    const lectureId = req.params['lectureId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const getLectureNoticeResult = await lectureProvider.selectLectureNotice(lectureId);

    return res.send(response(baseResponse.SUCCESS("강의 공지 조회에 성공"), getLectureNoticeResult));
}

exports.postLectureNotice = async function(req, res) {
    const token = req.verifiedToken;
    const lectureId = req.params['lectureId'];
    const userId = token.userId;
    const {title, content} = req.body;

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));

    if(!title)
        return res.send(errResponse(baseResponse.LECTURE_NOTICE_TITLE_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const postLectureResult = await lectureService.insertLectureNotice(lectureId, userId, title, content);

    return res.send(postLectureResult);
}

exports.putLectureNotice = async function(req, res){
    const token = req.verifiedToken;
    const lectureId = req.params['lectureId'];
    const noticeId = req.params['noticeId'];
    const userId = token.userId;
    const {title, content} = req.body;

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));

    if(!title)
        return res.send(errResponse(baseResponse.LECTURE_NOTICE_TITLE_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const putLectureResult = await lectureService.updateLectureNotice(userId, lectureId, noticeId, title, content);

    return res.send(putLectureResult);
}

exports.deleteLectureNotice = async function(req, res){
    const token = req.verifiedToken;
    const lectureId = req.params['lectureId'];
    const noticeId = req.params['noticeId'];
    const userId = token.userId;

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const deleteLectureResult = await lectureService.deleteLectureNotice(userId, lectureId, noticeId);

    return res.send(deleteLectureResult);
}

exports.getLectureInfo = async function(req, res){
    const lectureId = req.params['lectureId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_REVIEW_EMPTY));

    const checkLectureRow = await lectureProvider.checkLecture(lectureId);

    if(checkLectureRow.length < 1)
        return res.send(errResponse(baseResponse.LECTURE_NOT_EXISTENCE));

    const getLectureInfoResult = await lectureProvider.selectLectureInfo(lectureId);
    console.log('test', getLectureInfoResult);
    return res.send(response(baseResponse.SUCCESS("조회 성공 하였습니다."), getLectureInfoResult));

}

exports.getDashboardHeader = async function(req,res){
    const token = req.verifiedToken;
    const userId = token.userId;

    const lectureId = req.params.lectureId;

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));

    const getHeaderResult = await lectureProvider.getDashboardHeader(lectureId,userId);

    return res.send(getHeaderResult);

}

exports.getDashboardQuestion = async function(req,res){
    const token = req.verifiedToken;
    const userId = token.userId;

    const lectureId = req.params.lectureId;

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));

    const questionCntResult = await lectureProvider.getDashboardQuestionCnt(lectureId,userId);

    return res.send(questionCntResult);
}

exports.getDashboardCurriculum = async function(req,res){
    const token = req.verifiedToken;
    const userId = token.userId;

    const lectureId = req.params.lectureId;

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));

    const sessionClasses = await lectureProvider.getDashboardCurriculum(lectureId,userId);

    return res.send(sessionClasses);

}

exports.getUserHistories = async function(req, res) {
    const token = req.verifiedToken;
    const userId = token.userId;

    const userHistories = await lectureProvider.getUserHistories(userId);

    return res.send(response(baseResponse.SUCCESS("유저 기록 조회 성공"), userHistories));
}

exports.getLectureLateASC = async function(req, res) {
    const result = await lectureProvider.getLectureLateASC();

    return res.send(response(baseResponse.SUCCESS("최신 강의 조회 성공"), result));
}

exports.getLecturePopularDESC = async function(req, res) {
    const result = await lectureProvider.getLecturePopular();

    return res.send(response(baseResponse.SUCCESS("인기 강의 조회 성공"), result));
}