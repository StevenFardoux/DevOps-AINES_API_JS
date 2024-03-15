const mysql = require('mysql');
const helper = require("../helper");
const bcrypt = require('bcryptjs');
const { response } = require('express');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/Roles', async (req, res, next) => {
            let result;
            if (req.query.RoleId) {
                result = await query(`SELECT RoleId, Label FROM Roles WHERE RoleId = ${mysql.escape(req.query.RoleId)}`)
                if (result.length == 0) {
                    res.status(204).json({ succes: false, return: 'Not found' });
                }
            } else {
                if (req.headers.token != null) {
                    let tabUserInfo = await helper?.getInfoUser(req);
                    if (tabUserInfo[0].RoleId == 2) {
                        result = await query(`SELECT RoleId, Label FROM Roles`);
                        if (result.length == 0) {
                            res.status(400).json({ succes: false, return: 'No role id (RoleId) passed as parameter' });
                        }
                    } else {
                        res.status(403).json({ succes: false, return: 'Unauthorized actionrefused method' });
                    }
                } else {
                    res.status(403).json({ succes: false, return: 'Token required for this action' });
                }
            }
            res.status(200).json({ succes: true, return: result });
        });

        app.post('/Roles', async (req, res, next) => {
            letlibelle, result, checkData = true;

            let tabUserInfo = await helper?.getInfoUser(req);
            if (tabUserInfo[0].RoleId == 2) {
                if (req.body.Libelle != null) {
                    libelle = req.body.Libelle;
                } else {
                    res.status(400).json({ succes: false, return: 'No libelle (Libelle) passed as parameter' });
                    checkData = false;
                }

                if (checkData) {
                    result = await query(`INSERT INTO Roles VALUES(0, ${mysql.escape(libelle)});`);
                    if (result.length == 0) {
                        res.status(403).json({ succes: false, return: 'refused method' });
                    }
                }
            }
            res.status(200).json({ succes: true, return: result });
        });

        app.put('/Roles', async (req, res, next) => {
            let libelle, result, checkData = true;
            if (req.headers.token != null) {
                let tabUserInfo = await helper?.getInfoUser(req);
                if (tabUserInfo[0].RoleId == 2) {
                    if (req.body.libelle != null) {
                        libelle = req.body.libelle;
                    } else {
                        res.status(400).json({ succes: false, return: 'No libelle (Libelle) passed as parameter' });
                        checkData = false;
                    }

                    if (checkData) {
                        result = await query(`UPDATE Roles SET label = ${mysql.escape(libelle)};`);
                        if (result.length == 0) {
                            res.status(403).json({ succes: false, return: 'refused method' });
                        }
                    }
                }
            } else {
                res.status(403).json({ succes: false, return: 'Token required for this action' });
            }
            res.status(200).json({ succes: true, return: result });
        });

        app.delete('/Roles', async (req, res, next) => {
            let roleId, checkData = true;
            if (req.headers.token != null) {
                let tabUserInfo = await helper?.getInfoUser(req);
                if (tabUserInfo[0].RoleId == 2) {
                    if (req.body.roleId != null) {
                        roleId = req.body.RoleId;
                    } else {
                        result = "RoleId manquant";
                        res.status(204).json({ succes: false, return: 'No libelle (Libelle) passed as parameter' });
                        checkData = false;
                    }

                    if (checkData) {
                        result = await query(`DELETE FROM Roles WHERE RolesId = ${mysql.escape(roleId)};`);
                        if (result.length == 0) {
                            res.status(403).json({ succes: false, return: 'refused method' });
                        }
                    }
                }
            } else {
                res.status(403).json({ succes: false, return: 'Token required for this action' });
            }
            res.status(200).json({ succes: true, return: result });
        });
    }
}