const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const util = require("util");
const fs = require("fs");

const conn = mysql.createPool({
    host: '167.114.113.203',
    user: 'airneis',
    password: '41rn31s',
    database: 'airneis'
});

const query = util.promisify(conn.query).bind(conn);

conn.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('Connection successfull');
});

const app = express()

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

fs.readdir('API/', (err, files) => {
    files.forEach((file) => {
        require('./API/' + file).initFunction(app, query);
    }) 
})


app.listen(667, () => {
    console.log("lel");
});
