const mysql = require('mysql');
const helper = require("../helper");
const bcrypt = require('bcryptjs');
const { response } = require('express');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/ProductPicture', async (req, res, next) => {
            let result;

            if (req.query.ProductId != null) {
                if (req.query.Pictureid != null) {
                    result = await query(`SELECT PR.ProductId, PR.Name, PR.Price, PR.Description, PR.Rate, PR.Stock, PR.CreateAt, PI.PictureId, PI.link FROM ProductPicture PP INNER JOIN Products PR ON PP.ProductId = PR.ProductId INNER JOIN Picture PI ON PP.PictureId = PI.PictureId WHERE PP.ProductId = ${mysql.escape(req.query.ProductId)} AND PP.PictureId = ${req.query.Pictureid};`);
                } else {
                    result = await query(`SELECT PR.ProductId, PR.Name, PR.Price, PR.Description, PR.Rate, PR.Stock, PR.CreateAt, PI.PictureId, PI.link FROM ProductPicture PP INNER JOIN Products PR ON PP.ProductId = PR.ProductId INNER JOIN Picture PI ON PP.PictureId = PI.PictureId WHERE PP.ProductId = ${mysql.escape(req.query.ProductId)};`);
                }
            } else if (req.query.ProductId) {
                result = await query(`SELECT PR.ProductId, PR.Name, PR.Price, PR.Description, PR.Rate, PR.Stock, PR.CreateAt, PI.PictureId, PI.link FROM ProductPicture PP INNER JOIN Products PR ON PP.ProductId = PR.ProductId INNER JOIN Picture PI ON PP.PictureId = PI.PictureId WHERE PP.PictureId = ${req.query.Pictureid};`);
            } else {
                res.status(400).json({ succes: false, return: 'No products id (ProductId) OR pictures id (PictureId) passed as parameter' });
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.post('/ProductPicture', async (req, res, next) => {
            let checkData = true;
            let productId, pictureid, result;

            if (req.nody.ProductId != null) {
                productId = req.body.productId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No products id (ProductId) passed as parameter' });
            }

            if (req.body.pictureid != null) {
                pictureid = req.body.pictureid;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No pictures id (PictureId) passed as parameter' });
            }

            if (checkData) {
                if (req.headers.token != null) {
                    let tabUserInfo = helper.getInfoUser(req);
                    //Vérification si user existe
                    if (tabUserInfo[0].UserId != 0) {
                        //Vérification si user est Admin
                        if (tabUserInfo[0].RoleId == 2) {
                            result = await query(`INSERT INTO ProductPicture VALUES(${mysql.escape(productId)}, ${mysq$.escape(pictureid)});`);
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

        app.delete('/ProductPicture', async (req, res, next) => {
            let productId, pictureid, result;

            if (req.headers.token != null) {
                let tabUserInfo = helper.getInfoUser(req);
                //Vérification si user existe
                if (tabUserInfo[0].UserId != 0) {
                    //Vérification si user est Admin
                    if (tabUserInfo[0].RoleId == 2) {
                        if (req.body.ProductId != null) {
                            productId = req.n=body.productId;
                            if (res.body.pictureid != null) {
                                pictureid = req.body.pictureid;
                                result = await query(`DELETE FROM ProductPicture WHERE ProductId = ${mysql.escape(productId)} AND PictureId = ${mysql.escape(pictureid)};`);
                            } else {
                                result = await query(`DELETE FROM ProductPicture WHERE ProductId = ${mysql.escape(productId)};`);
                            }
                        } else if (res.body.pictureid != null) {
                            pictureid = req.body.pictureid;
                            result = await query(`DELETE FROM ProductPicture WHERE PictureId = ${mysql.escape(pictureid)};`);
                        }  else {
                            res.status(400).json({ succes: false, return: 'No products id (ProductId) OR pictures id (PictureId) passed as parameter' });
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