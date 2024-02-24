const mysql = require("mysql");
const helper = require("../helper");
const bcrypt = require('bcryptjs');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/Posseder', async (req, res, next) => {
            let  checkData = false;
            let result, cartId, productId;

            if (req.query.CartId != null) {
                cartId = req.query.CartId;
            } else {
                checkData = true;
                result = {'code error': "400", error: "No cart id (CartId) passed as parameter"};
            }
            if (req.query.ProductId != null) {
                productId = req.query.ProductId;
            } else {
                checkData = true;
                result = {'code error': "400", error: "No product id (ProductId) passed as parameter"};
            }

            if (checkData == false) {
                result = await query(`SELECT Quantity FROM Posseder WHERE CartId = ${mysql.escape(cartId)} AND ProductId = ${mysql.escape(productId)};`);
                if (result.length == 0) {
                    result = {'code error': "204", error: "Not found"};
                }
            }

            console.log(result);
            res.json(result);
        });

        app.post('/Posseder', async (req, res, next) => {
            let checkData = false;
            let result;

            if (req.body.CartId == null) {
                checkData = true;
                result = {'code error': "400", error: "No cart id (CartId) passed as parameter"};
            }
            if (req.body.ProductId == null) {
                checkData = true;
                result = {'code error': "400", error: "No product id (ProductId) passed as parameter"};
            }
            if (req.body.Quantity == null) {
                checkData = true;
                result = {'code error': "400", error: "No quantity (Quantity) passed as parameter"};
            }

            if (checkData == false) {
                result = await query(`INSERT INTO Posseder VALUES(${mysql.escape(ProductId)}, ${mysql.escape(CartId)}, ${mysql.escape(Quantity)};`);
                if (result.length == 0) {
                    result = {'code error': "403", error: "refused method"};
                }
            }
            console.log(result);
            res.json(result);
        });

        app.put('/Posseder', async (req, res, next) => {
            let result; 
            let checkData = false;

            if (req.body.CartId == null) {
                checkData = true;
                result = {'code error': "400", error: "No cart id (CartId) passed as parameter"};
            }
            if (req.body.ProductId == null) {
                checkData = true;
                result = {'code error': "400", error: "No product id (ProductId) passed as parameter"};
            }
            if (req.body.Quantity == null) {
                checkData = true;
                result = {'code error': "400", error: "No quantity (Quantity) passed as parameter"};
            }
            
            if (checkData == false) {
                result = await query(`UPDATE Posseder SET Quantity = ${mysql.escape(req.body.Quantity)} WHERE CartId = ${mysql.escape(req.body.CartId)} AND ProductId = ${mysql.escape(req.body.ProductId)};`);
                if (result.length == 0) {
                    result = {'code error': "403", error: "refused method"};
                }
            }
            console.log(result);
            res.json(result);
        });

        app.delete('/Posseder', async (res ,req, next) => {
            let result;
            let checkData = false;

            if (req.body.CartId == null) {
                checkData = true;
                result = {'code error': "400", error: "No cart id (CartId) passed as parameter"};
            }

            if (req.body.ProductId == null) {
                checkData == true;
                result = {'code error': "400", error: "No product id (ProductId) passed as parameter"};
            }

            if (checkData == false) {
                result = await query(`DELETE FROM Posseder WHERE CartId = ${mysql.escape(req.body.CartId)} AND ProductId = ${mysql.escape(req.body.ProductId)};`);
                if (result.length == 0) {
                    result = {'code error': "403", error: "refused method"};
                }
            }
            console.log(result);
            res.json(result);
        });
    }
}