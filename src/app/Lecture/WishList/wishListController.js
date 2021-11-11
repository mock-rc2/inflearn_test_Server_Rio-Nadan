const jwtMiddleware = require("../../../../config/jwtMiddleware");
const wishListProvider = require("./wishListProvider");
const wishListService = require("./wishListService");
const baseResponse = require("../../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../../config/response");
const {pool} = require("../../../../config/database");

exports.postWishListItem = async function(req, res) {

    const token = req.verifiedToken;

    const userId = token.userId;

    const lectureId = req.body.lectureId;

    const wishListCheckRows = await wishListProvider.selectUserWishList(userId);

    let wishListId;

    if(wishListCheckRows.length < 1){
        wishListId = await wishListService.createWishList(userId);
    }else{
        wishListId = wishListCheckRows[0].WISH_LIST_ID;
    }

    const insertResult = await wishListService.insertWishListItem(wishListId, lectureId)

    res.send(insertResult);
}