// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT EMAIL, USER_ID, STATUS
                FROM USERS 
                WHERE EMAIL = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT USER_ID, EMAIL, NICK_NAME 
                 FROM USERS 
                 WHERE USER_ID = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO USERS(email, password, USER_ROLE_KEY)
        VALUES (?, ?, 'S');
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT USER_ID, EMAIL, PASSWORD, STATUS
        FROM USERS 
        WHERE EMAIL = ? AND PASSWORD = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT STATUS, USER_ID
        FROM USERS 
        WHERE EMAIL = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserProfile(connection, id, nickName, userIntro) {
  const updateUserQuery = `
  UPDATE USERS 
  SET NICK_NAME = ?, INTRODUCE_MESSAGE = ?
  WHERE  USER_ID = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickName, userIntro, id]);
  return updateUserRow[0];
}

async function insertRefreshToken(connection, token, userId) {
  const insertTokenQuery = `
    UPDATE USERS 
      SET USER_REFRESH_TOKEN  = ? 
    WHERE USER_ID = ?;
  `;

  const insertTokenRow = await connection.query(insertTokenQuery, [token, userId]);

  return insertTokenRow;
}

async function updateUserEmail(connection, id, email) {
  const updateUserEmailQuery = `
    UPDATE USERS
    SET EMAIL = ?
    WHERE USER_ID = ?;
  `;

  const resultRows = await connection.query(updateUserEmailQuery, [email, id]);

  return resultRows;
}

async function updateUserPhoneNumber(connection, id, phoneNumber) {
  const updateUserPhoneNumQuery = `
    UPDATE USERS
    SET PHONE_NUMBER = ?
    WHERE USER_ID = ?;
  `;

  const resultRow = await connection.query(updateUserPhoneNumQuery, [phoneNumber, id]);

  return resultRow;
}

async function selectUserPhoneNumber(connection, phoneNumber) {
  const selectUserPhoneNumber = `
    SELECT PHONE_NUMBER
    FROM USERS
    WHERE PHONE_NUMBER = ?;
  `;

  const [resultRow] = await connection.query(selectUserPhoneNumber,phoneNumber);

  return resultRow;
}

async function selectUserNickName(connection, nickName) {
  const selectUserNickNameQuery = `
    SELECT NICK_NAME
    FROM USERS 
    WHERE NICK_NAME = ?;
  `;

  const [resultRow] = await connection.query(
      selectUserNickNameQuery,
      nickName
      );

  return resultRow;
}

async function selectUserToken(connection, token) {
  const selectTokenQuery = `
    SELECT USER_ID, USER_REFRESH_TOKEN
    FROM USERS
    WHERE USER_REFRESH_TOKEN = ?;
  `;
  const [selectTokenRow] = await connection.query(selectTokenQuery, token);
  return selectTokenRow;
}


module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserProfile,
  insertRefreshToken,
  updateUserEmail,
  updateUserPhoneNumber,
  selectUserPhoneNumber,
  selectUserNickName,
  selectUserToken
};
