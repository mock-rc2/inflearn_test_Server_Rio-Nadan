const lectures = require('./lectureController');
const wishList = require('./WishList/wishListController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

module.exports = function(app){
    // 강의 목록 API 브런치 따서 작업하면 됌
    app.get('/inflearn/courses/lectures', lectures.getAllLectureList);

    app.get('/inflearn/lectures/:lectureId/check', jwtMiddleware, lectures.getUserLecture);

    app.get('/inflearn/lectures/:lectureId/header', lectures.getLectureHeaderItems);

    app.get('/inflearn/lectures/:lectureId/introduction', lectures.getLectureIntroduction);

    app.get('/inflearn/lectures/:lectureId/curriculum', lectures.getSessionClasses);

    app.get('/inflearn/courses/lectures/:bigCategoryName',lectures.getBigLectureList);

    app.get('/inflearn/courses/lectures/:bigCategoryName/:middleCategoryName',lectures.getMiddleLectureList);

    app.get('/inflearn/lectures/:lectureId/reviews', lectures.getLectureReviews);

    app.post('/inflearn/lectures/:lectureId/reviews', jwtMiddleware, lectures.postLectureReview);

    app.put('/inflearn/lectures/:lectureId/reviews/:reviewId', jwtMiddleware, lectures.putLectureReview);

    app.delete('/inflearn/lectures/:lectureId/reviews/:reviewId',jwtMiddleware, lectures.deleteLectureReview);

    app.get('/inflearn/lectures/:lectureId/notice', lectures.getLectureNotice);

    app.post('/inflearn/lectures/:lectureId/notice', jwtMiddleware, lectures.postLectureNotice);

    app.put('/inflearn/lectures/:lectureId/notice/:noticeId', jwtMiddleware, lectures.putLectureNotice);

    app.delete('/inflearn/lectures/:lectureId/notice/:noticeId', jwtMiddleware, lectures.deleteLectureNotice);

    app.get('/inflearn/lectures/:lectureId/info', lectures.getLectureInfo);

    app.get('/inflearn/courses/:lectureId/dashboard/header',jwtMiddleware,lectures.getDashboardHeader);

    app.get('/inflearn/courses/:lectureId/dashboard/question',jwtMiddleware,lectures.getDashboardQuestion);

    app.get('/inflearn/courses/:lectureId/dashboard/curriculum',jwtMiddleware,lectures.getDashboardCurriculum);

    app.post('/inflearn/users/wishlist/items', jwtMiddleware, wishList.postWishListItem);

    app.get('/inflearn/users/wishlist/items', jwtMiddleware, wishList.getWishListItem);

    app.delete('/inflearn/users/wishlist/items', jwtMiddleware, wishList.deleteWishListItem);

    app.get('/inflearn/users/histories', jwtMiddleware, lectures.getUserHistories);

    app.get('/inflearn/lectures/latest', lectures.getLectureLateASC);

    app.get('/inflearn/lectures/popularity', lectures.getLecturePopularDESC);
};

