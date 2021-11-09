const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const requestHandler = require("../../../config/requestHandler");
const regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const qs = require('qs');

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
        return res.send(errResponse(baseResponse.SIGNIN_EMAIL_EMPTY("")));

    // 길이 체크
    if (email.length > 30)
        return res.send(errResponse(baseResponse.SIGNIN_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(errResponse(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    if(password.length === 0)
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));
    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        password
    );

    return res.send(signUpResponse);
};

exports.oauthLogin = async function (req, res) {
    try {
        const cooperation = req.params.cooperation;
        console.log(cooperation);
        switch (cooperation) {
            case 'kakao':
                // 인증 코드
                const code = req.query.code;
                console.log("code:", code)
                const requestBody = await userService.createKakaoBody(code);

                let option = {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                    body: qs.stringify(requestBody)
                };

                const accessToken = await requestHandler.requestAccessToken(option);
                console.log(accessToken);
                const tokenObj = JSON.parse(accessToken)

                const getOptions = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                        'Authorization': 'Bearer '+ tokenObj.access_token
                    }
                };

                const getRes = await requestHandler.requestUserEmail(getOptions);

                let userRow = JSON.parse(getRes);

                const email = userRow.kakao_account.email;

                const name = userRow.kakao_account.name;

                // 빈 값 체크
                if (!email)
                    return res.send(response(baseResponse.KAKAO_LOGIN_EMAIL_EMPTY));

                // 형식 체크 (by 정규표현식)
                if (!regexEmail.test(email))
                    return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

                const checkParam = await userProvider.emailCheck(email);

                if(checkParam.length < 1) {
                    const signUpResponse = await userService.oauthCreateUser(email, name);

                    return res.send(signUpResponse);
                }else {
                    const signInResponse = await userService.oauthSignIn(email, null);
                    return res.send(signInResponse);
                }
                break;
        }
    }catch (err) {
        console.error(err);
        res.send(response(baseResponse.KAKAO_LOGIN_FAIL));
    }
}

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

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(errResponse(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    const userEditEmailResult = await userService.editEmail(id, email);

    return res.send(userEditEmailResult);
}

exports.editPhoneNumber = async function (req, res) {
    const token = req.verifiedToken;

    const id = token.userId;

    const phoneNumber = req.body.phoneNumber;

    if(!phoneNumber) return res.send(errResponse(baseResponse.USER_PHONE_NUMBER_EMPTY));

    if(!regPhone.test(phoneNumber))
        return res.send(errResponse(baseResponse.USER_PHONE_NUMBER_TYPE_ERROR));

    const userEditPhoneResult = await userService.editPhoneNumber(id, phoneNumber);

    return res.send(userEditPhoneResult);
}

exports.userTokenIssuance = async function (req, res) {
    const token = req.headers['x-refresh-token'];

    if(!token) return res.send(errResponse(baseResponse.USER_TOKEN_EMPTY));

    const jwtIssuance = await userService.jwtTokenIssuance(token);

    return res.send(jwtIssuance);
}

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
