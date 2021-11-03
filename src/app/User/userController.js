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
     * Body: email, password
     */
    const {email, password} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY("")));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNIN_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    // 제가 지금 한거 입니다. 넵!
    if(password.length === 0)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));
    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        password
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

exports.editProfile = async function (req, res) {
    const token = req.verifiedToken;

    const userId = token.userId;

    const {nickName, userIntro} = req.body;

    if(!nickName) return res.send(errResponse(baseResponse.USER_NICK_NAME_EMPTY));

    const userEditProfileResult = await userService.editProfile(userId, nickName, userIntro);

    return res.send(userEditProfileResult);
};

exports.editEmail = async function (req, res) {
    const token = req.verifiedToken;

    const id = token.userId;

    const email = req.body.email;

    if(!email) return res.send(errResponse(baseResponse.USER_USEREMAIL_EMPTY));

    const userEditEmailResult = await userService.editEmail(id, email);

    return res.send(userEditEmailResult);
}

exports.editPhoneNumber = async function (req, res) {
    const token = req.verifiedToken;

    const id = token.userId;

    const phoneNumber = req.body.phoneNumber;

    if(!phoneNumber) return res.send(errResponse(baseResponse.USER_PHONE_NUMBER_EMPTY));

    const userEditPhoneResult = await userService.editPhoneNumber(id, phoneNumber);

    return res.send(userEditPhoneResult);
}

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
