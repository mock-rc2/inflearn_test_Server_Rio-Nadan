module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 테스트 API
    app.get('/inflearn/test', user.getTest)

    // 유저 로그인 API
    app.post('/inflearn/users/login', user.postLoginUsers);


    // 유저 회원가입 API
    app.post('/inflearn/users/signup',user.postUsers);

    app.patch('/inflearn/users/profile', jwtMiddleware, user.editProfile);

    app.patch('/inflearn/users/email', jwtMiddleware, user.editEmail);

    app.patch('/inflearn/users/phonenumber',jwtMiddleware, user.editPhoneNumber);
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API