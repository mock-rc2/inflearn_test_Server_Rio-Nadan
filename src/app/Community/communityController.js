const jwtMiddleware = require("../../../config/jwtMiddleware");
const lectureProvider = require("../Lecture/lectureProvider");
const lectureService = require("../Lecture/lectureService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const requestHandler = require("../../../config/requestHandler")
const regexEmail = require("regex-email");

exports.getBoardsRedirect = async function(req,res){

    return res.redirect('/inflearn/community/questions');
}

/**
 * API No.
 * API Name : 질문글 목록 조회 API
 * [GET] /inflearn/community/questions
 */
exports.getQuestionsList = async function(req,res){

}
