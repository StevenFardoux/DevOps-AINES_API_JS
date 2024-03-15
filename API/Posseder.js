const mysql = require("mysql");
const helper = require("../helper");
const bcrypt = require('bcryptjs');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/Posseder', async (req, res, next) => {
            let checkData = false;
            let result, OrderId, productId;

            if (req.query.OrderId != null) {
                OrderId = req.query.OrderId;
            } else {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No order id (OrderId) passed as parameter' });
            }
            if (req.query.ProductId != null) {
                productId = req.query.ProductId;
            } else {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No product id (ProductId) passed as parameter' });
            }

            if (checkData == false) {
                result = await query(`SELECT OrderId, ProductId, Quantity FROM Posseder WHERE OrderId = ${mysql.escape(OrderId)} AND ProductId = ${mysql.escape(productId)};`);
                if (result.length == 0) {
                    res.status(204).json({ succes: false, return: 'Not found' });
                }
            } else if (orderid != null) {
                result = await query(`SELECT OrderId, ProductId, Quantity FROM Posseder WHERE OrderId = ${mysql.escape(OrderId)};`);
                if (result.length == 0) {
                    res.status(204).json({ succes: false, return: 'Not found' });
                }
            } else if (productId != null) {
                result = await query(`SELECT OrderId, ProductId, Quantity FROM Posseder WHERE ProductId = ${mysql.escape(productId)};`);
                if (result.length == 0) {
                    res.status(204).json({ succes: false, return: 'Not found' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.post('/Posseder', async (req, res, next) => {
            let checkData = false;
            let result;

            if (req.body.OrderId == null) {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No order id (OrderId) passed as parameter' });
            }
            if (req.body.ProductId == null) {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No product id (ProductId) passed as parameter' });
            }
            if (req.body.Quantity == null) {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No quantity (Quantity) passed as parameter' });
            }

            if (checkData == false) {
                result = await query(`INSERT INTO Posseder VALUES(${mysql.escape(ProductId)}, ${mysql.escape(OrderId)}, ${mysql.escape(Quantity)};`);
                if (result.length == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.put('/Posseder', async (req, res, next) => {
            let result;
            let checkData = false;

            if (req.body.OrderId == null) {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No order id (OrderId) passed as parameter' });
            }
            if (req.body.ProductId == null) {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No product id (ProductId) passed as parameter' });
            }
            if (req.body.Quantity == null) {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No quantity (Quantity) passed as parameter' });
            }

            if (checkData == false) {
                result = await query(`UPDATE Posseder SET Quantity = ${mysql.escape(req.body.Quantity)} WHERE OrderId = ${mysql.escape(req.body.OrderId)} AND ProductId = ${mysql.escape(req.body.ProductId)};`);
                if (result.length == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.delete('/Posseder', async (res, req, next) => {
            let result;
            let checkData = false;

            if (req.body.OrderId == null) {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No order id (OrderId) passed as parameter' });
            }

            if (req.body.ProductId == null) {
                checkData == true;
                res.status(400).json({ succes: false, return: 'No product id (ProductId) passed as parameter' });
            }

            if (checkData == false) {
                result = await query(`DELETE FROM Posseder WHERE OrderId = ${mysql.escape(req.body.OrderId)} AND ProductId = ${mysql.escape(req.body.ProductId)};`);
                if (result.length == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });
    }
}