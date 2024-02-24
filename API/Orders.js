const mysql = require("mysql");
const helper = require("../helper");
const bcrypt = require('bcryptjs');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/Orders', async (req, res, next) => {
            let result;
            if (req.query.OrderId) {
                result = await query(`SELECT Statut, OrderDate, AddressId, CardId FROM Orders WHERE OrderId = ${mysql.escape(req.query.OrderId)}`);
                if (result.length == 0) {
                    result = {'code error': "204", error: "User not found"};
                }
            } else {
                if (req.headers.token != null) {
                    let tabUserInfo = await helper.getInfoUser(req);
                    if (tabUserInfo[0].UserId != 0) {
                        result = await query(`SELECT Statut, OrderDate, AddressId, CardId FROM Orders`);
                        if (result.length == 0) {
                            result = {'code error': "204", error: "Order not found"};
                        }
                    } else {
                        if (result.length == 0) {
                            result = {'code error': "204", error: "Users not found"};
                        }
                    }
                } else {
                    result = {'code error': "403", error: "Token required for this action"};
                }
            }
            console.log(result);
            res.json(result);
        });

        app.post('/Orders', async (req, res, next) => {
            let checkData = false;
            let result, AddressId, CardId;

            if (req.body.AddressId != null) {
                AddressId = req.body.AddressId;
            } else {
                checkData = true;
                result = {'code error': "400", error: "No address id (AddressId) passed as parameter"};
            }

            if (req.body.CardId != null) {
                CardId = req.body.CardId;
            } else {
                checkData = true;
                result = {'code error': "400", error: "No card id (CardId) passed as parameter"};
            }

            if (checkData == false) {
                result = await query(`INSERT INTO Orders VALUES(0, 0, NOW(), ${mysql.escape(AddressId)}, ${mysql.escape(CardId)});`);
                if (result == 0) {
                    result = {'code error': "403", error: "refused method"};
                }
            }
            console.log(result);
            res.json(result);
        });

        app.put('/Orders', async (req, res, next) => {
            let result, quer;
            quer = `UPDATE Orders SET `
            for (const key in req.body) {
                if (Object.hasOwnProperty.call(req.body, key)) {
                    if (key != 'OrdersId') {
                        const value = req.body[key];
                        quer += `${key} = ${mysql.escape(value)}, `
                    }
                }
            }
            quer = quer.substring(0, quer.length - 2);
            quer += ` WHERE OrderId = ${mysql.escape(req.body.OrderId)};`;
            
            result = await query(quer);
            if (result.length == 0) {
                result = {'code error': "403", error: "refused method"};
            }
            console.log(result);
            res.json(result);
        });

        app.delete('/Orders', async (req, res, next) => {
            let result;

            if (req.body.OrderId != null) {
                result = await query(`DELETE FROM Orders WHERE OrderId = ${mysql.escape(req.body.OrderId)};`);
                if (result.length == 0) {
                    result = {'code error': "403", error: "refused method"};
                }
            } else {
                result = {'code error': "204", error: "OrderId not found"};
            }
            console.log(result);
            res.json(result);
        });
    }
}