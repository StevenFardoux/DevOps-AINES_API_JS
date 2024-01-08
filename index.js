const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express()


app.get('*', (req, res, next) => {
    res.send('test');
});


app.listen(667, () => {
    console.log("lel");
});
