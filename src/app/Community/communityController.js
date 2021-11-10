const jwtMiddleware = require("../../../config/jwtMiddleware");
const lectureProvider = require("../Lecture/lectureProvider");
const lectureService = require("../Lecture/lectureService");
const communityProvider = require("../Community/communityProvider");
const communityService = require("../Community/communityService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const requestHandler = require("../../../config/requestHandler")
const regexEmail = require("regex-email");
const typeSet = new Set([0,1,2])

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
    const classId = req.body.classId;

    let typeDescription;

    if(!title || !content)
        return res.send(errResponse(baseResponse.COMMUNITY_BLANK_EXIST));

    switch (type){
        case 0:
            typeDescription = '질문/답변';
            break;
        case 1:
            typeDescription = '자유주제';
            break;
        case 2:
            typeDescription = '스터디 모집';
            break;
        default:
            return res.send(errResponse(baseResponse.COMMUNITY_TYPE_ERROR));
            break;
    }

    let postQuestionParams;

    if(!classId) {
        postQuestionParams = [userId,title,content,type,typeDescription];
    }
    else {
        postQuestionParams = [classId,userId,title,content,type,typeDescription];
    }


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

exports.getClassBoard = async function(req, res){
    const type = Number.parseInt(req.query.type);
    const classId = req.params.classId;

    if(!classId)
        return res.send(errResponse(baseResponse.CLASS_ID_EMPTY));

    if(!typeSet.has(type))
        return res.send(errResponse(baseResponse.TYPE_ID_WRONG));

    const getClassResult = await communityProvider.getClassBoard(type, classId);

    return res.send(response(baseResponse.SUCCESS("클래스 게시판 조회 성공"), getClassResult))
}