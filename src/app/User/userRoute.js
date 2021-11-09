const user = require('./userController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

module.exports = function(app){
    // 테스트 API
    app.get('/inflearn/test', user.getTest)

    // 유저 로그인 API
    app.post('/inflearn/users/login', user.postLoginUsers);

    // 유저 회원가입 API
    app.post('/inflearn/users/signup',user.postUsers);

    app.patch('/inflearn/users/profile', jwtMiddleware, user.editProfile);

    app.patch('/inflearn/users/email', jwtMiddleware, user.editEmail);

    app.patch('/inflearn/users/phonenumber',jwtMiddleware, user.editPhoneNumber);

    app.get('/inflearn/users/token/issuance', user.userTokenIssuance);

    // 소셜 로그인 API CORS 오류로 인한 보류
    app.get('/inflearn/oauth2/:cooperation', user.oauthLogin);

    // 강의 목록 API 브런치 따서 작업하면 됌


};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API