const mysql = require("mysql");
const helper = require("../helper");
const bcrypt = require('bcryptjs');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/Users', async (req, res, next) => {
            let result;
            if (req.query.UserId) {
                //getUsersID
                result = await query(`SELECT Firstname, Lastname, Mail, Password, RoleId FROM Users WHERE UserId = ${mysql.escape(req.query.UserId)}`);
                if (result.length == 0) {
                    res.status(204).json({ succes: false, return: 'Not found' });
                }
            }
            else {
                //GetUser
                //Verification avec token et droit en fonction du roleid
                if (req.headers.token != null) {
                    console.log(req.headers.token);
                    let tabUserInfo = await helper.getInfoUser(req);
                    //Vérification si user existe
                    if (tabUserInfo[0].UserId != 0) {
                        if (tabUserInfo[0].RoleId == 2) {
                            result = await query(`SELECT Firstname, Lastname, Mail, Password, RoleId FROM Users`);
                            if (result.length == 0) {
                                res.status(204).json({ succes: false, return: 'Not found' });
                            }
                        } else {
                            res.status(403).json({ succes: false, return: 'Unauthorized action' });
                        }
                    } else {
                        res.status(204).json({ succes: false, return: 'Users not found' });
                    }
                } else {
                    res.status(403).json({ succes: false, return: 'Token required for this action' });
                }
            }
            console.log(result)
            res.status(200).json({ succes: false, return: result });
        });


        app.post('/Users', async (req, res, next) => {
            let checkData = false;
            let result, lastName, mail, pwd, hash;
            let firstName;

            if (req.body.Firstname != null) {
                console.log(req.body.Firstname.toLowerCase());
                firstName = req.body.Firstname.toLowerCase();
            } else {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No first name (Firstname) passed as parameter' });
            }

            if (req.body.Lastname != null) {
                console.log(req.body.Lastname.toLowerCase());
                lastName = req.body.Lastname.toLowerCase();
            } else {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No name (Lastname) passed as parameter' });
            }

            if (req.body.Mail != null) {
                // Vérification que l'adresse mail est valide
                if (/^\S+@\S+\.\S+$/.test(req.body.Mail)) {
                    mail = req.body.Mail.toLowerCase();
                } else {
                    checkData = true;
                    res.status(400).json({ succes: false, return: 'Invalid e-mail address' });
                }
            } else {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No mail address (Mail) passed as parameter' });
            }

            if (req.body.Password != null) {
                //Vérification si le mdp est valide à faire
                pwd = req.body.Password;
                if (pwd.length >= 8 && /[0-9]/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[!@#$%^&*]/.test(pwd)) {
                    const salt = bcrypt.genSaltSync(10);
                    hash = bcrypt.hashSync(pwd, salt);
                } else {
                    checkData = true;
                    res.status(400).json({ succes: false, return: 'The password must contain at least 8 characters, a number, a capital letter and a special character.' });
                }
            } else {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No password passed as parameter' });
            }

            if (req.body.RoleId != null) {
                console.log(req.body.RoleId.toLowerCase());
                roleId = req.body.RoleId.toLowerCase();
            } else {
                checkData = true;
                res.status(400).json({ succes: false, return: 'No role id (RoleId) passed as parameter' });
            }

            if (checkData == false) {
                //toute les données ont été envoyer alors ont peux créer le user.
                let result = await query(`INSERT INTO Users VALUES(0, ${mysql.escape(firstName)}, ${mysql.escape(lastName)}, ${mysql.escape(mail)}, ${mysql.escape(hash)}, 1);`);
                if (result == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result)
            res.status(200).json({ succes: false, return: result });

        });


        app.put('/Users', async (req, res, next) => {
            let mail, pwd, checkData = false, result, idUser;
            console.log(req.body);
            if (req.headers.token != null) {
                let tabUserInfo = helper.getInfoUser(req);
                //Vérification si user existe
                if (tabUserInfo[0].UserId != 0) {
                    if (tabUserInfo[0].RoleId == 1) {
                        //prend l'id du compte
                        idUser = tabUserInfo[0].UserId;
                    } else if (tabUserInfo[0].RoleId == 2) {
                        //choix de l'id
                        if (req.body.id != null) {
                            idUser = mysql.escape(req.body.id)
                        } else {
                            res.status(400).json({ succes: false, return: 'No user id (userID) passed as parameter' });
                        }
                    }
                } else {
                    res.status(204).json({ succes: false, return: 'Users not found' });
                }

            } else {
                res.status(403).json({ succes: false, return: 'Token required for this action' });
            }
            if (req.body.Mail != null) {
                //Vérification que c'est bien un mail avec retour false si ce ne l'est pas + message.4
                if (/^\S+@\S+\.\S+$/.test(req.body.Mail)) {
                    mail = req.body.Mail.toLowerCase();
                } else {
                    checkData = true;
                    res.status(400).json({ succes: false, return: 'Invalid e-mail address' });
                }
            }

            if (req.body.password != null) {
                //Vérification que le mdp est valide, sinon retourne false avec message en conséquence.
                pwd = req.body.password;
                if (pwd.length >= 8 && /[0-9]/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[!@#$%^&*]/.test(pwd)) {
                    // Le mot de passe est valide
                } else {
                    checkData = true;
                    res.status(400).json({ succes: false, return: 'The password must contain at least 8 characters, a number, a capital letter and a special character.' });
                }
            }
            console.log(checkData)
            if (checkData == false) {
                let quer = `UPDATE Users SET `
                for (const key in req.body) {
                    if (Object.hasOwnProperty.call(req.body, key)) {
                        if (key != 'UserId') {
                            const value = req.body[key];
                            quer += `${key} = ${mysql.escape(value)}, `
                        }
                    }
                }
                quer = quer.substring(0, quer.length - 2);
                quer += ` WHERE UserId = ${mysql.escape(req.body.idUser)};`;
                console.log(quer);
                result = await query(quer)
                if (result.length == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result)
            res.status(200).json({ succes: false, return: result });
        });


        app.delete('/Users', async (req, res, next) => {
            let result;
            if (req.headers.token != null) {
                let tabUserInfo = helper.getInfoUser(req);
                //Vérification si user existe
                if (tabUserInfo[0].UserId != 0) {
                    if (tabUserInfo[0].RoleId == 1) {
                        //prend l'id du compte
                        idUser = tabUserInfo[0].UserId;
                    } else if (tabUserInfo[0].RoleId == 2) {
                        //choix de l'id
                        if (req.body.id != null) {
                            idUser = mysql.escape(req.body.id)
                        } else {
                            res.status(204).json({ succes: false, return: 'No user id (userID) passed as parameter' });
                        }
                    }
                } else {
                    res.status(204).json({ succes: false, return: 'Users not found' });
                }

            } else {
                res.status(403).json({ succes: false, return: 'Token required for this action' });
            }

            if (idUser != null) {
                result = await query(`DELETE FROM Users WHERE UserId = ${mysql.escape(idUser)};`);
                if (result.length == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            } else {
                res.status(204).json({ succes: false, return: 'No user id (userId) passed as parameter' });
            }
            console.log(result)
            res.status(200).json({ succes: false, return: result });
        });
    }
}