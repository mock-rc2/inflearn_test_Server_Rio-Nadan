const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const lectureProvider = require("../Lecture/lectureProvider");
const videoProvider = require("./videoProvider");
const videoService = require("./videoService");

exports.getWatchedVideo = async function (req, res) {
    const token = req.verifiedToken;
    const userId = token.userId;
    const lectureId = req.params['lectureId'];
    const classId = req.params['classId'];

    if(!lectureId)
        return res.send(errResponse(baseResponse.LECTURE_ID_EMPTY));

    if(!classId)
        return res.send(errResponse(baseResponse.CLASS_VIDEO_EMPTY));

    const userLectureRow = await lectureProvider.checkUserLecture(userId, lectureId);

    if(userLectureRow.length<1)
        return res.send(errResponse(baseResponse.CHECK_USER_LECTURES_FAIL));

    const watchedVideo = await videoProvider.selectWatchedVideo(userId, classId);

    console.log("test",watchedVideo.length );
    if(watchedVideo.length < 1){
        const firstWatchedResult = await videoService.insertWatchedVideo(userId, lectureId, classId);
        return res.send(firstWatchedResult);
    }else{
        return res.send(response(baseResponse.SUCCESS("강의 조회 성공") ,watchedVideo));
    }
}