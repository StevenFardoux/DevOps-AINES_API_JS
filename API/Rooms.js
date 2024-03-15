const mysql = require('mysql');
const helper = require("../helper");
const bcrypt = require('bcryptjs');
const { response } = require('express');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/Rooms', async (req, res, next) => {
            let checkData = true;

            if (req.query.RoomId) {
                result = await query(`SELECT Name FROM Rooms WHERE RoomId = ${mysql.escape(req.query.RoomId)};`);
                if (result == 0) {
                    res.status(42043).json({ succes: false, return: 'Room not found' });
                }
            } else {
                result = await query(`SELECT Name FROM Rooms`);
                if (result == 0) {
                    res.status(204).json({ succes: false, return: 'Rooms not found' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.post('/Rooms', async (req, res, next) => {
            let checkData = true;
            let RoomId, Name, result;

            if (req.body.RoomId) {
                RoomId = req.body.RoomId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No room id (RoomId) passed as parameter' });
            }
            if (req.body.Name) {
                Name = req.body.Name;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No name (Name) passed as parameter' });
            }

            if (checkData) {
                if (checkData) {
                    if (req.headers.token != null) {
                        let tabUserInfo = helper.getInfoUser(req);
                        //Vérification si user existe
                        if (tabUserInfo[0].UserId != 0) {
                            //Vérification si user est Admin
                            if (tabUserInfo[0].RoleId == 2) {
                                result = await query(`INSERT INTO Rooms VALUES(${mysql.escape(RoomId)}, ${mysql.escape(Name)});`);
                                if (result == 0) {
                                    res.status(403).json({ succes: false, return: 'refused method' });
                                }
                            } else {
                                res.status(403).json({ succes: false, return: 'refused method' });
                            }
                        } else {
                            res.status(204).json({ succes: false, return: 'Users not found' });
                        }
                    } else {
                        res.status(204).json({ succes: false, return: 'Token required for this action' });
                    }
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.put('/Rooms', async (req, res, next) => {
            let checkData = true;
            let RoomId, Name, result;

            if (req.body.RoomId) {
                RoomId = req.body.RoomId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No room id (RoomId) passed as parameter' });
            }
            if (req.body.Name) {
                Name = req.body.Name;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No name (Name) passed as parameter' });
            }

            if (checkData) {
                if (req.headers.token != null) {
                    let tabUserInfo = helper.getInfoUser(req);
                    //Vérification si user existe
                    if (tabUserInfo[0].UserId != 0) {
                        //Vérification si user est Admin
                        if (tabUserInfo[0].RoleId == 2) {
                            result = await query(`UPDATE Rooms SET Name = ${mysql.escape(Name)} WHERE RoomId = ${mysql.escape(RoomId)}`);
                            if (result == 0) {
                                res.status(403).json({ succes: false, return: 'refused method' });
                            }
                        } else {
                            res.status(403).json({ succes: false, return: 'refused method' });
                        }
                    } else {
                        res.status(204).json({ succes: false, return: 'Users not found' });
                    }
                } else {
                    res.status(403).json({ succes: false, return: 'Token required for this action' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.delete('/Rooms', async (req, res, next) => {
            let checkData = true;
            if (req.body.RoomId) {
                if (req.headers.token != null) {
                    let tabUserInfo = helper.getInfoUser(req);
                    //Vérification si user existe
                    if (tabUserInfo[0].UserId != 0) {
                        //Vérification si user est Admin
                        if (tabUserInfo[0].RoleId == 2) {
                            result = await query(`DELETE FROM Rooms WHERE RoomId = ${mysql.escape(req.body.RoomId)};`);
                            if (result == 0) {
                                res.status(403).json({ succes: false, return: 'refused method' });
                            }
                        } else {
                            res.status(403).json({ succes: false, return: 'refused method' });
                        }
                    } else {
                        res.status(403).json({ succes: false, return: 'Users not found' });
                    }
                } else {
                    res.status(403).json({ succes: false, return: 'Token required for this action' });
                }
            } else {
                res.status(400).json({ succes: false, return: 'No room id (RoomId) passed as parameter' });
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });
    }
}