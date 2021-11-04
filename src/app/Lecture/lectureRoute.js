module.exports = function(app){
    const lecture = require('./lectureController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 강의 목록 API 브런치 따서 작업하면 됌
    app.get('/inflearn/lectures', lecture.getLectureList);

    app.get('/inflearn/lectures/:lectureId/check', jwtMiddleware, lecture.getUserLecture);

    app.get('/inflearn/lectures/:lectureId/header', lecture.getLectureHeaderItems);

    app.get('/inflearn/lectures/:lectureId/introduction', lecture.getLectureIntroduction);
};
