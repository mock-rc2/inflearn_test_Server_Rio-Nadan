const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
     return res.send(response(baseResponse.SUCCESS("성공 입니다")))
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {email, password, nickname} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname
    );

    return res.send(signUpResponse);
};

/**
 * API Name : 유저 로그인 API
 * [POST] /inflearn/users/login
 */
exports.postLoginUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const {userId, password} = req.body;
    // 유저 아이디 값 확인
    if (!userId) return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    // 유저 패스워드 값 확인
    if (!password) return res.send(errResponse(baseResponse.USER_PASSWORD_EMPTY));
    // 유저아이디 길이 확인
    if(userId.length>50) return res.send(errResponse(baseResponse.SIGNUP_USER_ID_LENGTH));
    // 유저아이디 형식 확인
    if(!regexEmail.test(userId)) return res.send(errResponse(baseResponse.SIGNUP_USER_ID_ERROR_TYPE));

    const userLoginResult = await userService.loginUser(userId,password);

    return res.send(userLoginResult);
};


/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
