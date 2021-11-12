async function selectCartsItem(connection,userId) {
    const selectCartsQuery = `
    select 
        LECTURE_NAME,TITLE_IMAGE,PRICE,SALE_PERCENT,BASKETS.USER_ID
    from BASKETS
    inner join USERS U on BASKETS.USER_ID = U.USER_ID
    inner join BASKET_ITEMS BI on BASKETS.BASKET_ID = BI.BASKET_ID
    inner join LECTURES L on BI.LECTURE_ID = L.LECTURE_ID
        where BASKETS.USER_ID = ?  AND L.STATUS = 'active' ;
    `;

    const [resultRows] = await connection.query(selectCartsQuery,userId);
    return resultRows;
}

async function checkCartsItem(connection,userId,lectureId){
    const checkCartsQuery = `
    select
        BASKETS.BASKET_ID,LECTURE_NAME,TITLE_IMAGE,PRICE,SALE_PERCENT,BASKETS.USER_ID
    from BASKETS
    inner join USERS U on BASKETS.USER_ID = U.USER_ID
    inner join BASKET_ITEMS BI on BASKETS.BASKET_ID = BI.BASKET_ID
    inner join LECTURES L on BI.LECTURE_ID = L.LECTURE_ID
        where BASKETS.USER_ID = ? AND L.LECTURE_ID = ? AND L.STATUS = 'active';
    `;

    const [resultRows] = await connection.query(checkCartsQuery,[userId,lectureId]);

    return resultRows;
}

async function deleteCartItem(connection,basketId,lectureId) {

    const deleteCartsItemQuery = `
        DELETE FROM BASKET_ITEMS where BASKET_ID = ? AND LECTURE_ID = ?;
        `;

    const result = await connection.query(deleteCartsItemQuery,[basketId,lectureId]);
    return result;

}

async function selectUserBasketId(connection,userId) {
    const selectUserBasketQuery =`
    select 
        BASKET_ID
    from BASKETS
        where USER_ID = ?
    `;

    const [resultRow] = await connection.query(selectUserBasketQuery,userId);
    return resultRow;
}

async function postCartItem(connection,basketId,lectureId) {

    const postCartItemQuery = `
        insert into BASKET_ITEMS(BASKET_ID, LECTURE_ID) values (?,?);
        `;

    const result = await connection.query(postCartItemQuery,[basketId,lectureId]);
    return result;

}

async function selectReceipt(connection,userId) {
    const selectReceiptQuery = `
        select 
            UBH.LECTURE_ID,L.LECTURE_NAME,
            SALE_PRICE,date_format(UBH.CREATED_AT,'%Y년 %m월 %d일') as DATE,
            RECEIPT,STATEMENT_OF_TRANSACTION,UBH.STATUS
        from USER_BUY_HISTORIES UBH
        inner join LECTURES L on UBH.LECTURE_ID = L.LECTURE_ID
            where UBH.USER_ID = ?  AND (UBH.STATUS = 'bought' OR UBH.STATUS = 'partial bought' OR UBH.STATUS = 'refund');
    `;

    const [resultRows] = await connection.query(selectReceiptQuery,userId);

    return resultRows;
}

async function checkReceiptExist(connection,userId,userBuyId) {
    const checkReceiptQuery = `
    select USER_BUY_ID,STATUS
from USER_BUY_HISTORIES
where USER_ID = ? AND USER_BUY_ID = ?
  AND (STATUS = 'bought' OR STATUS = 'partial bought' OR STATUS = 'refund');
    `;

    const [resultRow] = await connection.query(checkReceiptQuery,[userId,userBuyId]);
    return resultRow;
}

async function deleteReceipt(connection,userId,userBuyId){

    const deleteReceiptQuery = `
    update USER_BUY_HISTORIES set STATUS = 'delete' 
        where USER_ID = ? AND USER_BUY_ID = ? 
            AND (STATUS = 'bought' OR STATUS = 'partial bought' OR STATUS = 'refund');
    `;

    const result = await connection.query(deleteReceiptQuery,[userId,userBuyId]);
    return result;

}

module.exports = {
    selectCartsItem,
    checkCartsItem,
    deleteCartItem,
    selectUserBasketId,
    postCartItem,
    selectReceipt,
    checkReceiptExist,
    deleteReceipt
}