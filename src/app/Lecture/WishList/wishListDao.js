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
module.exports = {
    insertWishList,
    selectWishList,
    insertWishListItem
}