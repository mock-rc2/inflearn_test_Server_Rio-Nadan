const user = require('./userController');
const payment = require('./Payment/paymentController');
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

    app.get('/inflearn/oauth2/:cooperation', user.oauthLogin);

    app.post('/inflearn/payments/carts/:lectureId',jwtMiddleware,payment.addItem);

    app.get('/inflearn/payments/carts',jwtMiddleware,payment.getCarts);

    app.delete('/inflearn/payments/carts/:lectureId',jwtMiddleware,payment.deleteItems);

    app.get('/inflearn/payments/receipts',jwtMiddleware,payment.getReceipt);

    app.delete('/inflearn/payments/receipts/:buyId',jwtMiddleware,payment.deleteReceipt);

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API