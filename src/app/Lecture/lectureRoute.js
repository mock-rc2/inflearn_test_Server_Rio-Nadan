module.exports = function(app){
    const lecture = require('./lectureController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 강의 목록 API 브런치 따서 작업하면 됌
    app.get('/inflearn/lectures', lecture.getLectureList);

};
