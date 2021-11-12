const jwtMiddleware = require("../../../config/jwtMiddleware");
const lectureProvider = require("../Lecture/lectureProvider");
const lectureService = require("../Lecture/lectureService");
const communityProvider = require("../Community/communityProvider");
const communityService = require("../Community/communityService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const requestHandler = require("../../../config/requestHandler")
const regexEmail = require("regex-email");
const typeSet = new Set([0,1,2]);

exports.getBoardsRedirect = async function(req,res){

    return res.redirect('/inflearn/community/questions');
}



/**
 * API No.
 * API Name : 질문글 작성 API
 * [POST] /inflearn/community/{boardType}
 */
exports.postBoard = async function(req,res){

    /**
     * Body : {type,title,contents}
     */

    const token = req.verifiedToken;
    const userId = token.userId;

    const boardType = req.params.boardType;
    const type = req.body.type;
    const title = req.body.title;
    const content = req.body.content;
    const classId = req.body.classId;

    let typeDescription;
    let postParams;


    if(boardType === 'questions' || boardType === 'chats'|| boardType === 'studies') {
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
    }else {
        return res.send(errResponse(baseResponse.COMMUNITY_TYPE_ERROR))
    }


    if(!title || !content)
        return res.send(errResponse(baseResponse.COMMUNITY_BLANK_EXIST));




    if(!classId) {
        postParams = [userId,title,content,type,typeDescription];
    }
    else {
        postParams = [classId,userId,title,content,type,typeDescription];
    }


    const postBoard = await communityService.insertBoard(postParams);

    return res.send(postBoard);

}
/**
 * API No.
 * API Name : 질문글 수정 API
 * [PATCH] /inflearn/community/{boardType}/{boardId}
 */

exports.updateQuestion = async function(req,res){

    /**
     * Path Variable : boardId , boardType
     * Body : {title,contents}
     */

    const token = req.verifiedToken;
    const userId = token.userId;

    const boardType = req.params.boardType;
    const boardId = req.params.boardId;
    const title = req.body.title;
    const content = req.body.content;

    let type = 0;

    switch (boardType){
        case 'questions':
            type = 0;
            break;
        case 'chats':
            type = 1;
            break;
        case 'studies':
            type = 2;
            break;
        default:
            return res.send(errResponse(baseResponse.COMMUNITY_TYPE_ERROR));
            break;
    }

    if(!title || !content)
        return res.send(errResponse(baseResponse.COMMUNITY_BLANK_EXIST));

    const patchQuestionBoard = await communityService.updateQuestionBoard(title,content,boardId,userId,type);

    return res.send(patchQuestionBoard);


}
/**
 * API No.
 * API Name : 질문글 삭제 API
 * [DELETE] /inflearn/community/{boardType}/{boardId}
 */
exports.deleteBoard = async function(req,res){
    /**
     * Path Variable : boardId,boardType
     */

    const token = req.verifiedToken;
    const userId = token.userId;

    const boardType = req.params.boardType;
    const boardId = req.params.boardId;

    let type = 0;


    switch (boardType){
        case 'questions':
            type = 0;
            break;
        case 'chats':
            type = 1;
            break;
        case 'studies':
            type = 2;
            break;
        default:
            return res.send(errResponse(baseResponse.COMMUNITY_TYPE_ERROR));
            break;
    }

    const deleteBoard = await communityService.deleteBoard(boardId,userId,type);

    return res.send(deleteBoard)

}

/**
 * API No.
 * API Name : 질문글 목록 조회 API
 * [GET] /inflearn/community/questions
 */
exports.getQuestionsList = async function(req,res){

    const type = 0;
    const sortQuery = req.query.order;
    let page = req.query.page;
    const pageSize = 5;

    let getQuestionList;
    if(!page){
        page = 1;
    }

    if(!sortQuery){
        getQuestionList= await communityProvider.getBoardList(type,page,pageSize);
    }else{
        getQuestionList = await communityProvider.getBoardListSort(type,sortQuery,page,pageSize);
    }


    return res.send(getQuestionList);
}

exports.getChatList = async function(req,res){

    const type = 1;
    let page = req.query.page;
    const sortQuery = req.query.order
    const pageSize = 5;

    let getChatList;
    if(!page){
        page = 1;
    }

    if(!sortQuery){
        getChatList= await communityProvider.getBoardList(type,page,pageSize);
    }else{
        getChatList = await communityProvider.getBoardListSort(type,sortQuery,page,pageSize);
    }

    return res.send(response(baseResponse.SUCCESS("자유주제 토론 글 목록 조회에 성공하였습니다"),getChatList));

}

exports.getStudyList = async function(req,res){
    const type = 2;
    let page = req.query.page;
    const sortQuery = req.query.order
    const pageSize = 5;

    let getStudyList;
    if(!page){
        page = 1;
    }

    if(!sortQuery){
        getStudyList= await communityProvider.getBoardList(type,page,pageSize);
    }else{
        getStudyList = await communityProvider.getBoardListSort(type,sortQuery,page,pageSize);
    }

    return res.send(response(baseResponse.SUCCESS("스터디 모집 글 목록 조회에 성공하였습니다"),getStudyList));
}

exports.getBoardInfo = async function(req,res){

    const boardType = req.params.boardType;
    const boardId = req.params.boardId;

    let type = 0;

    switch (boardType){
        case 'questions':
            type = 0;
            break;
        case 'chats':
            type = 1;
            break;
        case 'studies':
            type = 2;
            break;
        default:
            return res.send(errResponse(baseResponse.COMMUNITY_TYPE_ERROR));
            break;
    }

    const getBoardInfo = await communityProvider.getBoardInfo(type,boardId);

    return res.send(getBoardInfo);

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