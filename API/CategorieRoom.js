const mysql = require('mysql');
const helper = require("../helper");
const bcrypt = require('bcryptjs');
const { response } = require('express');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/CategorieRoom', async (req, res, next) => {
            if (req.query.RoomId) {
                if (req.query.CategorieId) {
                    result = await query(`SELECT CR.RoomId, R.Name, CR.CategoryId, C.Name, Description FROM CategoriesRoom CR INNER JOIN Rooms R ON CR.RoomId = R.RoomId INNER JOIN Categories C ON CR.CategoryId = C.CategoryId WHERE CR.RoomId = ${mysql.escape(req.query.RoomId)} AND CR.CategoryId = ${mysql.escape(req.query.CategorieId)}`);
                } else {
                    result = await query(`SELECT CR.RoomId, R.Name, CR.CategoryId, C.Name, Description FROM CategoriesRoom CR INNER JOIN Rooms R ON CR.RoomId = R.RoomId INNER JOIN Categories C ON CR.CategoryId = C.CategoryIdWHERE CR.RoomId = ${mysql.escape(req.query.RoomId)}`);
                }
            } else if (req.query.CategorieId) {
                result = await query(`SELECT CR.RoomId, R.Name, CR.CategoryId, C.Name, Description FROM CategoriesRoom CR INNER JOIN Rooms R ON CR.RoomId = R.RoomId INNER JOIN Categories C ON CR.CategoryId = C.CategoryId CR.CategoryId = ${mysql.escape(req.query.CategorieId)}`);
            } else {
                result = await query(`SELECT CR.RoomId, R.Name, CR.CategoryId, C.Name, Description FROM CategoriesRoom CR INNER JOIN Rooms R ON CR.RoomId = R.RoomId INNER JOIN Categories C ON CR.CategoryId = C.CategoryId`);
                if (result == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.post('/CategorieRoom', async (req, res, next) => {
            let checkdata = false;
            let CategorieId, RoomId, result

            if (req.body.CategorieId) {
                CategorieId = req.body.CategorieId;
            } else {
                checkdata = false;
                res.status(400).json({ succes: false, return: 'No categorie id (CategorieId) passed as parameter' });
            }

            if (req.body.RoomId) {
                RoomId = req.body.RoomId;
            } else {
                checkdata = false;
                res.status(400).json({ succes: false, return: 'No room id (RoomId) passed as parameter' });
            }

            if (checkdata) {
                if (req.headers.token != null) {
                    let tabUserInfo = helper.getInfoUser(req);
                    //Vérification si user existe
                    if (tabUserInfo[0].UserId != 0) {
                        //Vérification si user est Admin
                        if (tabUserInfo[0].RoleId == 2) {
                            result = await query(`INSERT INTO CategoriesRoom VALUES (${CategorieId}, ${RoomId});`);
                            if (result == 0) {
                                res.status(403).json({ succes: false, return: 'refused method' });
                            }
                        } else {
                            res.status(403).json({ succes: false, return: 'Unauthorized action' });
                        }
                    } else {
                        res.status(403).json({ succes: false, return: 'Users not found' });
                    }
                } else {
                    res.status(403).json({ succes: false, return: 'Token required for this action' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.delete('/CategorieRoom', async (req, res, next) => {
            let result;

            if (req.body.CategorieId) {
                if (req.Body.RoomId) {
                    result = await query(`DELETE FROM CategoriesRoom WHERE CategorieId = ${mysql.escape(req.body.CategorieId)} AND RoomId = ${mysql.escape(req.body.RoomId)};`);
                }
                else {
                    //vérif droit admin
                    if (req.headers.token != null) {
                        let tabUserInfo = helper.getInfoUser(req);
                        //Vérification si user existe
                        if (tabUserInfo[0].UserId != 0) {
                            //Vérification si user est Admin
                            if (tabUserInfo[0].RoleId == 2) {
                                result = await query(`DELETE FROM CategoriesRoom WHERE CategorieId = ${mysql.escape(req.body.CategorieId)};`);
                                if (result == 0) {
                                    res.status(403).json({ succes: false, return: 'refused method' });
                                }
                            } else {
                                res.status(403).json({ succes: false, return: 'Unauthorized action' });
                            }
                        } else {
                            res.status(403).json({ succes: false, return: 'Users not found' });
                        }
                    } else {
                        res.status(403).json({ succes: false, return: 'Token required for this action' });
                    }
                }
            } else if (req.Body.RoomId) {
                if (req.headers.token != null) {
                    let tabUserInfo = helper.getInfoUser(req);
                    //Vérification si user existe
                    if (tabUserInfo[0].UserId != 0) {
                        //Vérification si user est Admin
                        if (tabUserInfo[0].RoleId == 2) {
                            result = await query(`DELETE FROM CategoriesRoom WHERE RoomId = ${mysql.escape(req.body.RoomId)};`);
                            if (result == 0) {
                                res.status(403).json({ succes: false, return: 'refused method' });
                            }
                        } else {
                            res.status(403).json({ succes: false, return: 'Unauthorized action' });
                        }
                    } else {
                        res.status(403).json({ succes: false, return: 'Users not found' });
                    }
                } else {
                    res.status(403).json({ succes: false, return: 'Token required for this action' });
                }
            } else {
                res.status(400).json({ succes: false, return: 'No categorie id (CategorieId) OR room id (RoomId) passed as parameter' });
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });

        });
    }
}