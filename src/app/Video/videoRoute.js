const video = require('./videoController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

module.exports = function(app){
    app.get('/inflearn/lectures/:lectureId/classes/:classId/watch', jwtMiddleware, video.getWatchedVideo);

    app.patch('/inflearn/lectures/:lectureId/classes/:classId/watch', jwtMiddleware, video.patchWatchedVideo);

    app.get('/inflearn/lectures/:lectureId/classes/watch/list', jwtMiddleware, video.getWatchedVideoList);

    app.patch('/inflearn/lectures/:lectureId/classes/:classId/complete', jwtMiddleware, video.patchWatchedComplete);
}
