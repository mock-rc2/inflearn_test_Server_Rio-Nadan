async function insertWishList(connection, userId) {
    const insertWishListQuery = `
       INSERT INTO WISH_LISTS(USER_ID) VALUES (?);
    `;

    const [insertWishListResult] = await connection.query(
        insertWishListQuery,
        userId
    );

    return insertWishListResult;
}

async function selectWishList(connection, userId) {
    const selectWishListQuery = `
        SELECT WISH_LIST_ID, USER_ID
        FROM WISH_LISTS
        WHERE USER_ID = ?;
    `
    const [selectWishListResult] = await connection.query(
        selectWishListQuery,
        userId
    );

    return selectWishListResult;
}

async function insertWishListItem(connection, wishListId, lectureId) {
    const insertWishListItemQuery = `
        INSERT INTO WISH_LIST_ITEM(LECTURE_ID, WISH_LIST_ID)
        VALUES (?, ?);
    `
    const [resultRows] = await connection.query(
        insertWishListItemQuery,
        [lectureId, wishListId]
    );

    return resultRows;
}

async function selectWishListItems(connection, wishListId) {
    const selectWishListQuery = `
        SELECT LECTURES.LECTURE_ID, LECTURES.LECTURE_NAME, LECTURES.TITLE_IMAGE, LECTURES.PRICE, USERS.NICK_NAME
        FROM WISH_LIST_ITEM AS WISH 
            INNER JOIN LECTURES
                ON LECTURES.LECTURE_ID = WISH.LECTURE_ID
            INNER JOIN USERS
                ON USERS.USER_ID = LECTURES.USER_ID
        WHERE WISH_LIST_ID = ?;
    `;

    const [selectWishListResult] = await connection.query(
        selectWishListQuery,
        wishListId
    );

    return selectWishListResult;
}

async function selectWishListItem(connection, lectureId, wishListId){
    const selectWishListQuery = `
        SELECT WISH_LIST_ID, LECTURE_ID
        FROM WISH_LIST_ITEM
        WHERE LECTURE_ID = ? AND WISH_LIST_ID = ?;
    `;

    const [resultRows] = await connection.query(
        selectWishListQuery,
        [lectureId, wishListId]
    );

    return resultRows;
}

async function deleteWishListItems(connection, lectureId, wishListId) {
    const deleteWishList = `
        DELETE
        FROM WISH_LIST_ITEM
        WHERE LECTURE_ID = ? AND WISH_LIST_ID = ?;
    `;

    const [resultRows] = await connection.query(
        deleteWishList,
        [lectureId, wishListId]
    );

    return resultRows;
}
module.exports = {
    insertWishList,
    selectWishList,
    insertWishListItem,
    selectWishListItems,
    deleteWishListItems,
    selectWishListItem
}