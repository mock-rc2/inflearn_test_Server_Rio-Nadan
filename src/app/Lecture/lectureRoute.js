const lectures = require('./lectureController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

module.exports = function(app){
    // 강의 목록 API 브런치 따서 작업하면 됌
    app.get('/inflearn/courses/lectures', lectures.getAllLectureList);


    app.get('/inflearn/lectures/:lectureId/check', jwtMiddleware, lectures.getUserLecture);

    app.get('/inflearn/lectures/:lectureId/header', lectures.getLectureHeaderItems);

    app.get('/inflearn/lectures/:lectureId/introduction', lectures.getLectureIntroduction);

    app.get('/inflearn/lectures/:lectureId/curriculum', lectures.getSessionClasses);

    app.get('/inflearn/courses/lectures/:bigCategoryName',lectures.getBigLectureList);

    app.get('/inflearn/courses/lectures/:topCategoryName/:middleCategoryName',lectures.getMiddleLectureList);

    app.get('/inflearn/lectures/:lectureId/reviews', lectures.getLectureReviews);

    app.post('/inflearn/lectures/:lectureId/reviews', jwtMiddleware, lectures.postLectureReview);

    app.put('/inflearn/lectures/:lectureId/reviews/:reviewId', jwtMiddleware, lectures.putLectureReview);

    app.delete('/inflearn/lectures/:lectureId/reviews/:reviewId',jwtMiddleware, lectures.deleteLectureReview);

};
