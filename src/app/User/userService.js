const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (email, password) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [email, hashedPassword];

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);

        // 데이터 INSERT 검증
        if (userIdResult.affectedRows == 0) {
            await connection.rollback();
            return errResponse(baseResponse.SIGNUP_USER_FAIL);
        }

        return response(baseResponse.SUCCESS("회원가입 성공입니다."));


    } catch (err) {
        await connection.rollback();
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    } finally {
        connection.release();
    }
};


exports.oauthCreateUser = async function(email,name){

    try{
        const connection = await pool.getConnection(async (conn) => conn);

        const insertUserInfoParams = [email,name];

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS("회원가입 성공입니다."));


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}

// TODO: After 로그인 인증 방법 (JWT)
exports.loginUser = async function (userId, password) {
    connection = await pool.getConnection(async (conn) => conn);

    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(userId);
        console.log(emailRows);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_USER_INFO_WRONG);

        const selectEmail = emailRows[0].EMAIL;

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const userInfoRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (userInfoRows[0].PASSWORD !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_USER_INFO_WRONG);
        }

        if (userInfoRows[0].STATUS === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].STATUS === "DELETE") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log("ID: ", userInfoRows[0].USER_ID) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].USER_ID,
                message: "login",
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "6h",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        //토큰 생성 Service
        let refreshToken = await jwt.sign(
            {}, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "30d",
                issuer: "rio",
            } // 유효 기간 30일
        );


        const connection = await pool.getConnection(async (conn) => conn);


        const refreshTokenInsertResult = await userDao.insertRefreshToken(connection, refreshToken, userInfoRows[0].USER_ID);

        if (refreshTokenInsertResult.affectedRows == 0) {
            await connection.rollback();
            return errResponse(baseResponse.INSERT_REFRESH_TOKEN_FAIL);
        }

        return response(baseResponse.SUCCESS("로그인을 성공하였습니다."), {
            'userId': userInfoRows[0].USER_ID,
            'jwt': token,
            'refreshToken': refreshToken
        });

    } catch (err) {
        await connection.rollback();
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

/*

exports.oauthSignIn = async function(email){
    try {
        // 이메일 여부 확인
        const userInfoRows = await userProvider.emailCheck(email);
        console.log(userInfoRows);
        if (userInfoRows.length < 1) return errResponse(baseResponse.SIGNIN_USER_INFO_WRONG);

        const selectEmail = userInfoRows[0].EMAIL;


        if (userInfoRows[0].STATUS === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].STATUS === "DELETE") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log("id: ", userInfoRows[0].USER_ID) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].USER_ID,
                message: "login",
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "6h",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        //토큰 생성 Service
        let refreshToken = await jwt.sign(
            {
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "30d",
                issuer: "rio",
            } // 유효 기간 30일
        );

        const connection = await pool.getConnection(async (conn) => conn);

        const refreshTokenInsertResult = await userDao.insertRefreshToken(connection, refreshToken, userInfoRows[0].USER_ID);

        connection.release();

        return response(baseResponse.SUCCESS("로그인을 성공하였습니다."), {'userId': userInfoRows[0].USER_ID, 'jwt': token, 'refreshToken': refreshToken});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.SERVER_ERROR);
    }
}
*/


exports.editProfile = async function (id, nickName, userIntro) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const nickNameCheckRow = await userProvider.nickNameCheck(nickName);

        const editProfileResult = await userDao.updateUserProfile(connection, id, nickName, userIntro);

        if(nickNameCheckRow.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        //업데이트 검증
        if (editProfileResult.affectedRows == 0) {
            await connection.rollback();
            return errResponse(baseResponse.UPDATE_PROFILE_FAIL);
        }

        return response(baseResponse.SUCCESS("프로필 변경에 성공하였습니다."));
    } catch (err) {
        await connection.rollback();
        logger.error(`App - editUserProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    } finally {
        connection.release();
    }
}

exports.editEmail = async function (id, email) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const emailCheckRow = userProvider.emailCheck(email);
        if (emailCheckRow.length > 0) return response(errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL));

        const editEmailResult = await userDao.updateUserEmail(connection, id, email);

        // 업데이트 검증
        if (editEmailResult.affectedRows == 0) {
            await connection.rollback();
            return errResponse(baseResponse.UPDATE_EMAIL_FAIL);
        }

        return response(baseResponse.SUCCESS("이메일 변경에 성공하였습니다."));
    } catch (err) {
        await connection.rollback();
        logger.error(`App - editUserEmail Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    } finally {
        connection.release();
    }
}

exports.editPhoneNumber = async function (id, phoneNumber) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const phoneNumberCheckRow = userProvider.phoneNumberCheck(phoneNumber);

        if (phoneNumberCheckRow.length > 0) return errResponse(baseResponse.USER_REDUNDANT_PHONE_NUMBER);

        const editPhoneNumResult = await userDao.updateUserPhoneNumber(connection, id, phoneNumber);

        // 업데이트 검증
        if (editPhoneNumResult.affectedRows == 0) {
            await connection.rollback();
            return errResponse(baseResponse.UPDATE_PHONE_NUMBER_FAIL);
        }

        return response(baseResponse.SUCCESS("휴대폰 번호 변경에 성공하였습니다."));
    } catch (err) {
        await connection.rollback();
        logger.error(`App - editUserEmail Service error\n: ${err.message}`);
        return errResponse(baseResponse.SERVER_ERROR);
    } finally {
        connection.release();
    }
}

exports.jwtTokenIssuance = async function(token) {

    const tokenCheckRow = await userProvider.refreshTokenCheck(token);

    if(tokenCheckRow.length < 1)
        return errResponse(baseResponse.USER_TOKEN_NOT_EXISTENCE);

    const userId = tokenCheckRow[0].USER_ID;

    //토큰 생성 Service
    let jwtToken = await jwt.sign(
        {
            userId: userId,
            message: "login",
        }, // 토큰의 내용(payload)
        secret_config.jwtsecret, // 비밀키
        {
            expiresIn: "6h",
            subject: "userInfo",
        }
    );
    return response(baseResponse.SUCCESS("토큰 발급 성공"), {'userId': userId, 'jwt': jwtToken});

}

exports.createKakaoBody = async function(code) {
    const clientId = secret_config.kakaoRestKey;
    const redirectUri = secret_config.kakaoRedirectUri;
    const clientSecret = secret_config.kakaoSecretKey;

    const requestParams = {
        'code' : code,
        'grant_type' : 'authorization_code',
        'client_id' : clientId,
        'redirect_uri' : redirectUri,
        'client_secret' : clientSecret
    }

    return requestParams;
}

exports.oauthSignIn = async function(email) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].STATUS === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].STATUS === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].USER_ID,
                message: "login",
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "6h",
                subject: "userInfo",
            } // 유효 기간 6시간
        );

        //토큰 생성 Service
        let refreshToken = await jwt.sign(
            {
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "30d",
                issuer: "rio",
            } // 유효 기간 30일
        );

        const refreshTokenInsertResult = await userDao.insertRefreshToken(connection, refreshToken, userInfoRows[0].USER_ID);

        connection.release();

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].USER_IO, 'jwt': token, 'refreshToken': refreshToken});

    } catch (err) {
        await connection.rollback();
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR, err);
    }finally {
        connection.release();
    }
}