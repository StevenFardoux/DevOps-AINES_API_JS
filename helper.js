const express = require("express");
const mysql = require('mysql');
const util = require("util");

const conn = mysql.createPool({
    host: '167.114.113.203',
    user: 'airneis',
    password: '41rn31s',
    database: 'airneis'
});

const query = util.promisify(conn.query).bind(conn);

module.exports = {
    getInfoUser: async (req) => {
        let result;
        if (req.headers.token != null) {
             result = await query(`SELECT DISTINCT U.UserId, RoleId FROM Session S INNER JOIN Users U ON S.userId = U.UserId WHERE token = ${mysql.escape(req.headers.token)};`);
        } else {
            result = [{
                UserId : 0,
                RoleId: 0
            }];
        }
        return result
    }
}