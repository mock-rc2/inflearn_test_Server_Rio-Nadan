const community = require('./communityController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

module.exports = function(app) {

    app.get('/inflearn/community/',community.getBoardsRedirect);

    app.get('/inflearn/community/questions',community.getQuestionsList);

    app.get('/inflearn/community/chats',community.getChatList);

    app.get('/inflearn/community/studies',community.getStudyList);

    app.post('/inflearn/community/:boardType',jwtMiddleware,community.postBoard);

    app.patch('/inflearn/community/:boardType/:boardId',jwtMiddleware,community.updateQuestion);

    app.delete('/inflearn/community/:boardType/:boardId',jwtMiddleware,community.deleteBoard);

    app.get('/inflearn/community/:boardType/:boardId',community.getBoardInfo);

    app.get('/inflearn/classes/:classId/community', community.getClassBoard);
}
