const mysql = require('mysql');
const helper = require("../helper");
const bcrypt = require('bcryptjs');
const { response } = require('express');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/ProductColor', async (req, res, next) => {
            let checkData = true;
            let ProductId, ColorId, result;

            if (req.query.ProductId) {
                ProductId = req.query.ProductId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No product id (ProductId) passed as parameter' });
            }
            if (req.query.ColorId) {
                ColorId = req.query.ColorId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No color id (ColorId) passed as parameter' });
            }

            if (checkData) {
                result = await query(`SELECT productId, colorId FROM ProductColors WHERE productId = ${mysql.escape(ProductId)} AND colorId =${mysql.escape(ColorId)};`);
            } else if (ProductId != null) {
                result = await query(`SELECT productId, colorId FROM ProductColors WHERE productId = ${mysql.escape(ProductId)};`);
            } else if (ColorId != null) {
                result = await query(`SELECT productId, colorId FROM ProductColors WHERE colorId = ${mysql.escape(ColorId)};`);
            } else {
                res.status(400).json({ succes: false, return: 'No product id (ProductId) or color id (ColorId) passed as parameter' });
            }

            console.log(result);
                res.status(200).json({ succes: true, return: result });
        });

        app.post('/ProductColor', async (req, res, next) => {
            let checkData = true;
            let ProductId, ColorId, result;

            if (req.body.ProductId) {
                ProductId = req.body.ProductId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No product id (ProductId) passed as parameter' });
            }
            if (req.body.ColorId) {
                ColorId = req.body.ColorId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No color id (ColorId) passed as parameter' });
            }

            if (checkData) {
                result = await query(`INSERT INTO ProductColors VALUES(${mysql.escape(ProductId)}, ${mysql.escape(ColorId)});`);
                if (result == 0) {
                res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result);
                res.status(200).json({ succes: true, return: result });
        });

        app.delete('/ProductColor', async (req, res, next) => {
            let checkData = true;
            let ProductId, ColorId, result;

            if (req.body.ProductId) {
                ProductId = req.body.ProductId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No product id (ProductId) passed as parameter' });
            }
            if (req.body.ColorId) {
                ColorId = req.body.ColorId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No color id (ColorId) passed as parameter' });
            }

            if (checkData) {
                result = await query(`DELETE FROM ProductColors WHERE productId = ${mysql.escape(ProductId)} AND colorid = ${mysql.escape(ColorId)};`);
                if (result == 0) {
                res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result);
                res.status(200).json({ succes: true, return: result });
        });
    }
}