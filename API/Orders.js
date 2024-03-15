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
                    res.status(204).json({ succes: false, return: 'User not found' });
                }
            } else {
                if (req.headers.token != null) {
                    let tabUserInfo = await helper.getInfoUser(req);
                    if (tabUserInfo[0].UserId != 0) {
                        result = await query(`SELECT Statut, OrderDate, AddressId, CardId FROM Orders`);
                        if (result.length == 0) {
                            res.status(403).json({ succes: false, return: 'refused method' });
                        }
                    } else {
                        if (result.length == 0) {
                            res.status(204).json({ succes: false, return: 'Users not found' });
                        }
                    }
                } else {
                    res.status(403).json({ succes: false, return: 'Token required for this action' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.post('/Orders', async (req, res, next) => {
            let checkData = false;
            let result, AddressId, CardId;

            if (req.body.AddressId != null) {
                AddressId = req.body.AddressId;
            } else {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No address id (AddressId) passed as parameter' });
            }

            if (req.body.CardId != null) {
                CardId = req.body.CardId;
            } else {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No card id (CardId) passed as parameter' });
            }

            if (checkData == false) {
                result = await query(`INSERT INTO Orders VALUES(0, 0, NOW(), ${mysql.escape(AddressId)}, ${mysql.escape(CardId)});`);
                if (result == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
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
                res.status(403).json({ succes: false, return: 'refused method' });
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.delete('/Orders', async (req, res, next) => {
            let result;

            if (req.body.OrderId != null) {
                result = await query(`DELETE FROM Orders WHERE OrderId = ${mysql.escape(req.body.OrderId)};`);
                if (result.length == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            } else {
                res.status(204).json({ succes: false, return: 'OrderId not found' });
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });
    }
}