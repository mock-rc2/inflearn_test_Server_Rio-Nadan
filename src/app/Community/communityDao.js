async function selectBoardList(connection,type) {
    const selectBoardsListQuery = `
    select 
        BOARDS.BOARD_ID,BOARD_TITLE,NICK_NAME, BOARD_CONTENT,
        LECTURE_NAME,CLASS_NAME,date_format(BOARDS.UPDATED_AT,'%Y년 %m월 %d일') as DATE,
        count(ANSWER_ID) as cnt 
    from BOARDS
inner join USERS U on BOARDS.USER_ID = U.USER_ID
left join LECTURE_CLASSES LC on BOARDS.CLASS_ID = LC.CLASS_ID
left join LECTURE_SESSION LS on LC.SESSION_ID = LS.SESSION_ID
left join LECTURES L on LS.LECTURE_ID = L.LECTURE_ID
left join ANSWERS A on BOARDS.BOARD_ID = A.BOARD_ID
    where BOARD_TYPE = ? AND BOARDS.STATUS = 'active'
        group by BOARDS.BOARD_ID;
    `;

    const [resultRow] = await connection.query(selectBoardsListQuery,type);
    return resultRow;

}

async function insertBoard(connection,params){
    const insertBoardQuery = `
    insert into 
        BOARDS(USER_ID,BOARD_TITLE,BOARD_CONTENT,BOARD_TYPE,BOARD_TYPE_DESCRIPTION) 
    values (?,?,?,?,?);
    `;

    const result = await connection.query(insertBoardQuery,params);
    return result;
}

async function checkQuestionBoard(connection,boardId){
    const checkQuestionQuery = `
    select BOARD_ID from BOARDS where BOARD_ID = ? AND STATUS = 'active';
    `;

    const [resultRow] = await connection.query(checkQuestionQuery,boardId);
    return resultRow;
}

async function checkQuestionBoardIsMine(connection,boardId,userId){
    const checkQuestionIsMine = `
    select BOARD_ID from BOARDS where BOARD_ID = ? AND USER_ID = ? AND STATUS = 'active';
    `;

    const [resultRow] = await connection.query(checkQuestionIsMine,[boardId,userId]);
    return resultRow;
}

async function updateQuestionBoard(connection,params) {
    const updateQuestionQuery = `
    update BOARDS set 
        BOARD_TITLE = ? ,BOARD_CONTENT = ? 
    where BOARD_ID = ? 
        AND BOARD_TYPE = ? 
        AND STATUS = 'active';
    `;

    const result = await connection.query(updateQuestionQuery,params);
    return result;
}

async function checkBoardType(connection,boardId) {
    const checkBoardTypeQuery = `
    select 
        BOARD_TYPE,BOARD_TYPE_DESCRIPTION
    from BOARDS
        where BOARD_ID = ? AND STATUS = 'active';
    `;

    const [resultRow] = await connection.query(checkBoardTypeQuery,boardId);
    return resultRow;
}

async function deleteBoard(connection,boardId) {
    const deleteBoardQuery = `
    update BOARDS set STATUS = 'delete' where BOARD_ID = ? AND STATUS = 'active';
    `;

    const result = await connection.query(deleteBoardQuery,boardId);
    return result
}

async function selectBoardInfo(connection,boardId,type){
    const selectBoardQuery = `
    select 
        BOARDS.BOARD_ID,BOARD_TITLE, BOARD_CONTENT,
        date_format(BOARDS.UPDATED_AT,'%Y.%m.%d') as DATE,
        LECTURE_NAME,CLASS_NAME,count(ANSWER_ID) as cnt
    from BOARDS
    inner join USERS U on BOARDS.USER_ID = U.USER_ID
    left join LECTURE_CLASSES LC on BOARDS.CLASS_ID = LC.CLASS_ID
    left join LECTURE_SESSION LS on LC.SESSION_ID = LS.SESSION_ID
    left join LECTURES L on LS.LECTURE_ID = L.LECTURE_ID
    left  join ANSWERS A on BOARDS.BOARD_ID = A.BOARD_ID
        where BOARDS.BOARD_ID = ? AND BOARD_TYPE = ? AND BOARDS.STATUS = 'active'
group by BOARDS.BOARD_ID;
    `;

    const [resultRow] = await connection.query(selectBoardQuery,[boardId,type]);
    return resultRow;
}

module.exports = {
    selectBoardList,
    insertBoard,
    checkQuestionBoard,
    checkQuestionBoardIsMine,
    updateQuestionBoard,
    checkBoardType,
    deleteBoard,
    selectBoardInfo
}
