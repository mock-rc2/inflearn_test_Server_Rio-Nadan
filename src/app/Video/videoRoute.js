const video = require('./videoController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

module.exports = function(app){
    app.get('/inflearn/lectures/:lectureId/classes/:classId/watch', jwtMiddleware, video.getWatchedVideo);

    app.put('/inflearn/lectures/:lectureId/classes/:classId/watch', jwtMiddleware, video.putWatchedVideo)
}
