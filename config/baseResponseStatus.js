
module.exports = {

    SUCCESS: function successSet (message) {
        return {"isSuccess": true, "code": 1000, "message":message}
    },
    // Common
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    USER_ID_EMPTY : { "isSuccess": false, "code": 2000, "message":"유저 아이디가 비어있습니다." },
    USER_PASSWORD_EMPTY : { "isSuccess": false, "code": 2001, "message":"비밀번호가 비어있습니다." },
    SIGNUP_USER_ID_LENGTH : { "isSuccess": false, "code": 2002, "message":"아이디는 50자리 미만으로 입력해주세요." },
    SIGNUP_USER_INFO_WRONG : { "isSuccess": false, "code": 2003, "message":"비밀번호 또는 아이디가 틀렸습니다." },
    SIGNUP_USER_ID_ERROR_TYPE : { "isSuccess": false, "code": 2004, "message": "잘못된 아이디 형식입니다." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    USER_NICK_NAME_EMPTY: {"isSuccess": false, "code": 2019, "message": "유저 닉네임이 비어있습니다"},
    USER_REDUNDANT_PHONE_NUMBER: {"isSuccess": false, "code": 2020, "message": "중복된 휴대폰 번호 입니다"},
    USER_PHONE_NUMBER_EMPTY: {"isSuccess": false, "code": 2021, "message": "휴대폰 번호가 비어있습니다"},
    USER_PHONE_NUMBER_TYPE_ERROR:{"isSuccess": false, "code": 2022, "message": "잘못된 휴대폰 번호 양식입니다."},
    LECTURE_NOT_EXISTENCE:{"isSuccess": false, "code": 2023, "message": "존재하지 않는 강의 입니다"},
    LECTURE_REVIEW_EMPTY:{"isSuccess": false, "code": 2024, "message": "리뷰가 비어있습니다."},
    USER_REVIEW_NOT_EXIST:{"isSuccess": false, "code": 2025, "message": "작성한 리뷰가 없습니다."},

    LECTURE_ID_REVIEW_EMPTY:{"isSuccess": false, "code": 2026, "message": "강의 아이디가 비어있습니다."},
    USER_TOKEN_EMPTY:{"isSuccess": false, "code": 2027, "message": "토큰이 비어 있습니다."},
    KAKAO_LOGIN_EMAIL_EMPTY:{"isSuccess": false, "code": 2028, "message": "카카오 이메일이 비어 있습니다."},


    LECTURE_ID_EMPTY:{"isSuccess": false, "code": 2026, "message": "강의 아이디가 비어있습니다."},
    LECTURE_NOTICE_TITLE_EMPTY:{"isSuccess": false, "code": 2028, "message": "공지 제목이 비어있습니다."},
    CLASS_VIDEO_EMPTY:{"isSuccess": false, "code": 2029, "message": "class 비디오가 비어있습니다."},
    CLASS_ID_EMPTY:{"isSuccess": false, "code": 2030, "message": "class ID가 비어있습니다."},

    // Nadan
    CATEGORY_NOT_EXIST : {"isSuccess": false, "code": 2031, "message": "존재하지 않는 카테고리입니다."},
    COMMUNITY_BLANK_EXIST : {"isSuccess": false, "code": 2032, "message": "빈칸이 존재합니다"},
    COMMUNITY_TYPE_ERROR : {"isSuccess": false, "code": 2033, "message": "올바른 게시글 타입이 아닙니다."},
    SORT_TYPE_ERROR : {"isSuccess": false, "code": 2034, "message": "올바른 정렬 타입이 아닙니다."},


    TYPE_ID_WRONG:{"isSuccess": false, "code": 2041, "message": "잘못된 타입 아이디 입니다."},
    USER_WISH_LIST_NOT_EXIST:{"isSuccess": false, "code": 2042, "message": "유저 위시리스트가 없습니다."},
    USER_WISH_LIST_ITEM_NOT_EXIST:{"isSuccess": false, "code": 2043, "message": "유저 위시리스트 아이템이 없습니다."},
    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_USER_INFO_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디 또는 비밀번호가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },
    TOKEN_EXPIRED_FAIL:{ "isSuccess": false, "code": 3007, "message":"JWT 토큰 유효기간 만료"},
    TOKEN_EMPTY:{ "isSuccess": false, "code": 3007, "message":"JWT 토큰이 비어있습니다."},
    UPDATE_EMAIL_FAIL:{ "isSuccess": false, "code": 3008, "message":"이메일 업데이트에 실패했습니다."},
    UPDATE_PROFILE_FAIL:{ "isSuccess": false, "code": 3009, "message":"프로필 업데이트에 실패했습니다."},
    SIGNUP_USER_FAIL: { "isSuccess": false, "code": 3010, "message":"회원가입에 실패했습니다."},
    INSERT_REFRESH_TOKEN_FAIL: { "isSuccess": false, "code": 3011, "message":"refresh 토큰 동기화에 실패했습니다."},
    UPDATE_PHONE_NUMBER_FAIL: { "isSuccess": false, "code": 3012, "message":"휴대폰 번호 저장이 실패했습니다."},
    CHECK_USER_LECTURES_FAIL: { "isSuccess": false, "code": 3013, "message":"강의를 소유하지 않았습니다."},
    GET_LECTURE_INTRODUCTION_FAIL: { "isSuccess": false, "code": 3014, "message":"강의 소개 조회를 실패하였습니다."},
    GET_LECTURE_SESSION_FAIL: { "isSuccess": false, "code": 3015, "message":"강의 세션 조회를 실패하였습니다."},
    INSERT_LECTURE_REVIEW_FAIL: { "isSuccess": false, "code": 3016, "message":"강의 리뷰 작성을 실패하였습니다."},
    UPDATE_LECTURE_REVIEW_FAIL: { "isSuccess": false, "code": 3017, "message":"강의 리뷰 수정을 실패하였습니다."},
    DELETE_LECTURE_REVIEW_FAIL: { "isSuccess": false, "code": 3018, "message":"강의 리뷰 삭제를 실패하였습니다."},
    USER_TOKEN_NOT_EXISTENCE: { "isSuccess": false, "code": 3019, "message":"존재하지 않는 토큰 입니다."},

    DONT_HAVE_PERMISSION:{ "isSuccess": false, "code": 3020, "message":"권한이 없는 접근입니다."},

    //Nadan
    INSERT_BOARD_FAIL:{ "isSuccess": false, "code": 3021, "message":"게시 중 오류가 발생했습니다"},
    CHECK_BOARD_FAIL:{ "isSuccess": false, "code": 3022, "message":"존재하지 않는 게시물입니다."},
    UPDATE_BOARD_DENIED:{ "isSuccess": false, "code": 3023, "message":"게시물을 수정할 권한이 없습니다."},
    UPDATE_BOARD_FAIL:{ "isSuccess": false, "code": 3024, "message":"수정 중 오류가 발생했습니다."},
    WRONG_BOARD_PATH:{ "isSuccess": false, "code": 3025, "message":"잘못된 게시글 경로입니다."},
    DELETE_BOARD_FAIL : { "isSuccess": false, "code": 3026, "message":"삭제 중 오류가 발생했습니다."},

    CHECK_ITEM_NOT_EXIST : { "isSuccess": false, "code": 3027, "message":"수강 바구니에 강의가 없습니다"},
    DELETE_ITEM_FAIL : { "isSuccess": false, "code": 3028, "message":"삭제 중 오류가 발생했습니다."},
    ITEM_ALREADY_EXIST :{ "isSuccess": false, "code": 3029, "message":"수강바구니에 이미 강의가 있습니다."},
    RECEIPT_NOT_EXIST :{ "isSuccess": false, "code": 3030, "message":"구매내역이 존재하지 않습니다."},


    INSERT_LECTURE_NOTICE_FAIL:{ "isSuccess": false, "code": 3041, "message":"강의 공지 작성을 실패하였습니다."},
    UPDATE_LECTURE_NOTICE_FAIL:{ "isSuccess": false, "code": 3042, "message":"강의 공지 수정을 실패하였습니다."},
    DELETE_LECTURE_NOTICE_FAIL:{ "isSuccess": false, "code": 3043, "message":"강의 공지 삭제를 실패하였습니다."},
    KAKAO_LOGIN_FAIL:{ "isSuccess": false, "code": 3044, "message":"카카오 로그인이 실패하였습니다."},
    INSERT_WATCHED_VIDEO_TIME_FAIL:{ "isSuccess": false, "code": 3045, "message":"시청 기록 저장에 실패 했습니다."},
    UPDATE_WATCHED_VIDEO_TIME_FAIL:{ "isSuccess": false, "code": 3046, "message":"시청 기록에 실패 했습니다."},
    USER_WATCHED_HISTORY_NOT_EXIST:{ "isSuccess": false, "code": 3047, "message":"유저가 시청한 기록이 없습니다."},
    USER_UPDATE_CLASS_COMPLETE_FAIL:{ "isSuccess": false, "code": 3048, "message":"강의 완료가 실패 하였습니다"},
    CREATE_WISH_LIST_FAIL:{ "isSuccess": false, "code": 3049, "message":"위시리스트 생성에 실패 하였습니다."},
    INSERT_WISH_LIST_ITEM_FAIL:{ "isSuccess": false, "code": 3050, "message":"위시리스트 아이템 저장에 실패 하였습니다."},

    DELETE_WISH_LIST_ITEM_FAIL:{ "isSuccess": false, "code": 3061, "message":"위시리스트 아이템 삭제에 실패 하였습니다."},

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
