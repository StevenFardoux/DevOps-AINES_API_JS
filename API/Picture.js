const mysql = require('mysql');
const helper = require("../helper");
const bcrypt = require('bcryptjs');
const { response } = require('express');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/Picture', async (req, res, next) => {
            let result
            if (req.query.PictureId) {
                result = await query(`SELECT link FROM Picture WHERE PictureId = ${mysql.escape(req.query.PictureId)};`);
            } else {
                result = await query(`SELECT link FROM Picture;`);
            }
            if (result == 0) {
                res.status(403).json({ succes: false, return: 'Picture not found' });
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.post('/Picture', async (req, res, next) => {
            let checkData = true;
            let result, link;

            if (linreq.body.Link != null) {
                link = req.body.Link;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No link (Link) passed as parameter' });
            }

            if (checkData) {
                if (req.headers.token != null) {
                    let tabUserInfo = helper.getInfoUser(req);
                    //Vérification si user existe
                    if (tabUserInfo[0].UserId != 0) {
                        //Vérification si user est Admin
                        if (tabUserInfo[0].RoleId == 2) {
                            if (req.query.PictureId != null) {
                                result = await query(`INSERT INTO Picture VALUES(0, ${link});`);
                                if (result == 0) {
                                    res.status(403).json({ succes: false, return: 'Pictures not found' });
                                }
                            } else {
                                res.status(400).json({ succes: false, return: 'No link (Link) passed as parameter' });
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

        app.put('/Picture', async (req, res, next) => {
            let checkData = true;
            let pictureId, link;

            if (req.nody.PictureId != null) {
                pictureId = req.body.PictureId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No picture id (PictureId) passed as parameter' });
            }

            if (req.body.Link != null) {
                link = req.nidy.Link;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No link (Link) passed as parameter' });
            }

            if (checkData) {
                if (req.headers.token != null) {
                    let tabUserInfo = helper.getInfoUser(req);
                    //Vérification si user existe
                    if (tabUserInfo[0].UserId != 0) {
                        //Vérification si user est Admin
                        if (tabUserInfo[0].RoleId == 2) {
                            if (req.query.PictureId != null) {
                                result = await query(`UPDATE Picture SET link = ${mysql.escape(link)} WHERE PictureId = ${mysql.escape(pictureId)};`);
                                if (result == 0) {
                                    res.status(403).json({ succes: false, return: 'refused method' });
                                }
                            } else {
                                res.status(400).json({ succes: false, return: 'No link (Link) passed as parameter' });
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

        app.delete('/Picture', async (req, res, next) => {
            let checkData = true;
            let result;

            if (req.headers.token != null) {
                let tabUserInfo = helper.getInfoUser(req);
                //Vérification si user existe
                if (tabUserInfo[0].UserId != 0) {
                    //Vérification si user est Admin
                    if (tabUserInfo[0].RoleId == 2) {
                        if (req.query.PictureId != null) {
                            result = await query(`DELETE FROM Picture WHERE PictureId = ${mysql.escape(req.body.PictureId)};`);
                            if (result == 0) {
                                res.status(403).json({ succes: false, return: 'refused method' });
                            }
                        } else {
                            res.status(400).json({ succes: false, return: 'No link (Link) passed as parameter' });
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
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });
    }
}