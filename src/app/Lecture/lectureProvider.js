const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const lectureDao = require("./lectureDao");

exports.getLectureList = async function(){
    const connection = await pool.getConnection(async (conn)=>conn);

    const resultList = await lectureDao.selectLectureList(connection);
    const tagResult = await lectureDao.selectLectureTag(connection);
    const middleResult = await lectureDao.selectLectureMiddle(connection);
    // console.log(tagResult);
    console.log(middleResult);

    let map = new Map();
    // console.log("쌩 map: " + map);
    // [{id:1,name:스프링 강의},{id:2,name: 디자인 패턴 강의}]

    // {id:1,name:스프링 강의} -> row, {id:2,name: 디자인 패턴 강의} -> row
    await resultList.forEach(function(row){
        // row = {id:1,name:스프링 강의,tag:[]}
        row.MIDDLE_CATEGORY_NAME = [];
        row.TAG = [];

        // row.tag = [] -> row에 tag배열 추가.

        // console.log("resultList_row:" + row.tag);
        //map(1) -> {id:1,name:스프링 강의,tag:[]}
        //map(2) -> {id:2,name: 디자인 패턴 강의,tag:[]}
        map.set(row.LECTURE_ID, row);
        // console.log(row.LECTURE_ID);
        // console.log(map.get(1));
        // console.log(map.has(row.LECTURE_ID));
        // console.log(map.size);
        // console.log(map.keys());
        // console.log(row);

    });

    await middleResult.forEach(function(row){
       let lecture = map.get(row.LECTURE_ID);
       console.log(lecture);
       lecture.MIDDLE_CATEGORY_NAME.push(row.MIDDLE_CATEGORY_NAME);
       map.set(row.LECTURE_ID,lecture);
    });

    // console.log(map);
    // [{id:1, name:backend}, {id:1, name:java}, {id:2 , name:java}]
    await tagResult.forEach(function (row){
        //{id:1,name:스프링 강의,tag:[]}
        let lecture = map.get(row.LECTURE_ID);
        //{id:1,name:스프링 강의,tag:[{id:1, name:backend}]}
        //{id:1,name:스프링 강의,tag:[{id:1, name:backend}, {id:1, name:java}]}
        lecture.TAG.push(row.CATEGORY_TAG_NAME);
        //map(1) ->{id:1,name:스프링 강의,tag:[{id:1, name:backend}]}
        //map(1) ->{id:1,name:스프링 강의,tag:[{id:1, name:backend}, {id:1, name:java}]}
        map.set(row.LECTURE_ID, lecture);
        // console.log(lecture);
    });

    // console.log(map);



    connection.release();

    return response(baseResponse.SUCCESS("강의정보 조회에 성공했습니다."),Object.fromEntries(map));
}