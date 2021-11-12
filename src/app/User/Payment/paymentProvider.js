const { pool } = require("../../../../config/database");
const { logger } = require("../../../../config/winston");
const baseResponse = require("../../../../config/baseResponseStatus");
const {response} = require("../../../../config/response");
const {errResponse} = require("../../../../config/response");
const userDao = require("../../User/userDao");
const lectureDao = require("../../Lecture/lectureDao");
const paymentDao = require('./paymentDao');
const paymentService = require("./paymentService");

exports.getCartsItem = async function(userId){

    const connection = await pool.getConnection(async (conn)=>conn);

    try{
        let getCartsResult = await paymentDao.selectCartsItem(connection,userId);

        let totalPrice = 0;
        let prevTotalPrice = 0;
        getCartsResult.forEach((row)=>{
            let sale = 1 - (0.01 * (row.SALE_PERCENT));

            row.payPrice = row.PRICE * sale;
            prevTotalPrice += row.PRICE;
            totalPrice += row.payPrice;
        })

        let obj = {
            PREV_TOTAL_PRICE : prevTotalPrice,
            FOR_SALE_TOTAL_PRICE : totalPrice
        }
        getCartsResult.push(obj);

        return getCartsResult;

    }finally {
        connection.release();
    }

}

exports.getReceiptHistory = async function(userId){

    const connection = await pool.getConnection(async(conn)=>conn );

    const getReceipt = await paymentDao.selectReceipt(connection,userId);
    if(getReceipt.length < 1){
        return errResponse(baseResponse.RECEIPT_NOT_EXIST)
    }

    connection.release();

    return response(baseResponse.SUCCESS("구매내역 조회에 성공하였습니다"),getReceipt);

}