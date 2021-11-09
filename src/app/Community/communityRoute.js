const community = require('./communityController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

module.exports = function(app) {

    app.get('/inflearn/community/',community.getBoardsRedirect);

    app.get('/inflearn/community/questions',community.getQuestionsList);

    app.post('/inflearn/community/questions',jwtMiddleware,community.postQuestion);

    app.patch('/inflearn/community/questions/:boardId',jwtMiddleware,community.updateQuestion);

    app.delete('/inflearn/community/questions/:boardId',jwtMiddleware,community.deleteQuestion);

}
