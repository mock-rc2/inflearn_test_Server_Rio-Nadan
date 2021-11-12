const request = require('sync-request');
const baseResponse = require("../config/baseResponseStatus");

exports.requestAccessToken = async function (option){
    try{
        const res = await request('POST','https://kauth.kakao.com/oauth/token',option);

        let token = res.getBody();

        return token.toString();
    }catch (err) {
        return err;
    }
};

exports.requestUserEmail = async function(option){
    try{
        const res = await request('GET','https://kapi.kakao.com/v2/user/me',option);

        let userInfoRes = res.getBody();
        console.log('response---------------------\n', userInfoRes);

        return userInfoRes.toString();
    }catch(err){
        return err;
    }
}