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
                if (result.length = 0) {
                    result = {'code error': "204", error: "Role not found"}
                }
            } else {
                if (req.headers.token != null) {
                    let tabUserInfo = await helper?.getInfoUser(req);
                    if (tabUserInfo[0].RoleId == 2) {
                        result = await query(`SELECT RoleId, Label FROM Roles`);
                        if (result.length = 0) {
                            result = {'code error': "204", error: "Roles not found"}
                        }
                    } else {
                        result = {'code error': "403", error: "Unauthorized action"};
                    }
                } else {
                    result = {'code error': "403", error: "Token required for this action"};
                }
            }
            res.json(result);
        });

        app.post('/Roles', async (req, res, next) => {
            letlibelle, result, checkData = false;

            let tabUserInfo = await helper?.getInfoUser(req);
            if (tabUserInfo[0].RoleId == 2) {
                if (req.body.libelle != null) {
                    libelle = req.body.libelle;
                } else {
                    result = {'code error': "204", error: "Missing libelle"}
                    checkData = true;
                }

                if (checkData == false) {
                    result = await query(`INSERT INTO Roles VALUES(0, ${mysql.escape(libelle)});`);
                    if (result.length = 0) {
                        result = {'code error': "403", error: "refused method"};
                    }
                }
            }
            res.json(result);
        });

        app.put('/Roles', async (req, res, next) => {
            let libelle, result, checkData = false;
            if (req.headers.token != null) {
                let tabUserInfo = await helper?.getInfoUser(req);
                if (tabUserInfo[0].RoleId == 2) { 
                    if (req.body.libelle != null) {
                        libelle = req.body.libelle;
                    } else {
                        result = {'code error': "204", error: "Missing libelle"}
                        checkData = true;
                    }
        
                    if (checkData == false) {
                        result = await query(`UPDATE Roles SET label = ${mysql.escape(libelle)};`);
                        if (result.length = 0) {
                            result = {'code error': "403", error: "refused method"};
                        }
                    }
                }
            } else {
                result = {'code error': "403", error: "Token required for this action"};
            }
            res.json(result)
        });

        app.delete('/Roles', async (req, res, next) => {
            let roleId, checkData = false;
            if (req.headers.token != null) {
                let tabUserInfo = await helper?.getInfoUser(req);
                if (tabUserInfo[0].RoleId == 2) {  
                    if (req.body.roleId != null) {
                        roleId = req.body.RoleId;
                    } else {
                        result = "RoleId manquant";
                        result = {'code error': "204", error: "Missing libelle"}
                        checkData = true;
                    }

                    if (checkData == false) {
                        result = await query(`DELETE FROM Roles WHERE RolesId = ${mysql.escape(roleId)};`);
                        if (result.length = 0) {
                            result = {'code error': "403", error: "refused method"};
                        }
                    }
                }
            } else {
                result = {'code error': "403", error: "Token required for this action"};
            }
            res.json(result);
        });
    }
}