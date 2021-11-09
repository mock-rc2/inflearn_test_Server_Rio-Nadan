const community = require('./communityController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

module.exports = function(app) {

    app.get('/inflearn/community/',community.getBoardsRedirect);

    app.get('/inflearn/community/questions',community.getQuestionsList);

}
