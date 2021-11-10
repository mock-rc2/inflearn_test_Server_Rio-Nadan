const jwtMiddleware = require("../../../config/jwtMiddleware");
const lectureProvider = require("../Lecture/lectureProvider");
const lectureService = require("../Lecture/lectureService");
const communityProvider = require("../Community/communityProvider");
const communityService = require("../Community/communityService");
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

    const getQuestionList = await communityProvider.getQuestionList();

    return res.send(response(baseResponse.SUCCESS("질문 목록 조회에 성공하였습니다"),getQuestionList));
}

/**
 * API No.
 * API Name : 질문글 작성 API
 * [POST] /inflearn/community/questions
 */

exports.postQuestion = async function(req,res){

    /**
     * Body : {type,title,contents}
     */

    const token = req.verifiedToken;
    const userId = token.userId;

    const type = req.body.type;
    const title = req.body.title;
    const content = req.body.content;

    let typeDescription;
    if(!title || !content)
        return res.send(errResponse(baseResponse.COMMUNITY_BLANK_EXIST));

    if(type === 0){
        typeDescription = '질문/답변';
    }else if(type === 1){
        typeDescription = '자유주제';
    }else if(type === 2){
        typeDescription = '스터디 모집'
    }else{
        return res.send(errResponse(baseResponse.COMMUNITY_TYPE_ERROR));
    }

    const postQuestionParams = [userId,title,content,type,typeDescription];

    const postQuestionBoard = await communityService.insertQuestionBoard(postQuestionParams);

    return res.send(postQuestionBoard);

}
/**
 * API No.
 * API Name : 질문글 수정 API
 * [PATCH] /inflearn/community/questions/{boardId}
 */

exports.updateQuestion = async function(req,res){

    /**
     * Path Variable : boardId
     * Body : {title,contents}
     */

    const token = req.verifiedToken;
    const userId = token.userId;

    const boardId = req.params.boardId;
    const title = req.body.title;
    const content = req.body.content;

    if(!title || !content)
        return res.send(errResponse(baseResponse.COMMUNITY_BLANK_EXIST));

    const patchQuestionBoard = await communityService.updateQuestionBoard(title,content,boardId,userId);

    return res.send(patchQuestionBoard);


}
/**
 * API No.
 * API Name : 질문글 삭제 API
 * [DELETE] /inflearn/community/questions/{boardId}
 */
exports.deleteQuestion = async function(req,res){
    /**
     * Path Variable : boardId
     */

    const token = req.verifiedToken;
    const userId = token.userId;

    const boardId = req.params.boardId;

    const deleteQuestionBoard = await communityService.deleteQuestionBoard(boardId,userId);

    return res.send(deleteQuestionBoard)

}