module.exports = function(app){
    const lectures = require('./lectureController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 강의 목록 API 브런치 따서 작업하면 됌
    app.get('/inflearn/courses/lectures', lectures.getAllLectureList);

};
