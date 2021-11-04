const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'inflearn-database.czzcule8mgp6.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    port: '3306',
    password: 'inflearn1234!',
    database: 'inflearn'
});

module.exports = {
    pool: pool
};