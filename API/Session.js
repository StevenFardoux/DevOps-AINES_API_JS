const mysql = require("mysql");
const { v4: uuidv4 } = require('uuid')

module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/Session', async (req, res, next) => {
            //getByToken
            let result;
            if (req.query.token != null) {
                result = await query(`SELECT UserId FROM Session WHERE token = ${mysql.escape(req.query.token)}`)
                if (result.length == 0) {
                    result = {'code error': "403", error: "refused method"};
                }
            } else {
                result = {'code error': "403", error: "Token required for this action"};
            }
            console.log(result);
            res.json(result);
        });

        app.post('/Session', async (req, res, next) => {
            let checkData = false, mail, pwd, result, user;
            console.log(req.body)
            if (req.body.Mail != null) {
                mail = req.body.Mail;
            } else {
                checkData = true;
                result = {'code error': "400", error: "No first name (Firstname) passed as parameter"}
            }

            if (req.body.Password != null) {
                pwd = req.body.Password;
            } else {
                checkData = true;
                result = {'code error': "400", error: "No password passed as parameter"}
            }


            if (checkData == false) {
                // check si le user existe bien.
                user = await query(`SELECT UserId, Password FROM Users WHERE Mail = ${mysql.escape(mail)};`);
                console.log(user);
                if (user.length == 0) {
                    result = {'code error': "204", error: "Users not found"};
                } else {
                    //Vérification mdp correct
                    if (bcrypt.compareSync(pwd, user[0].Password)) {
                        let token = uuidv4();
                        result = await query(`SELECT id FROM Session WHERE token = ${mysql.escape(token)}`);
                        while (result != "") {
                            console.log('token :' + token);
                            token = uuidv4();
                            result = await query(`SELECT id FROM Session WHERE token = ${mysql.escape(token)}`);
                        }
                        console.log('token :' + token);
                        result = await query(`INSERT INTO Session VALUES(0, ${mysql.escape(token)}, ${mysql.escape(user[0].UserId)})`);
                        if (result.length == 0) {
                            result = {'code error': "403", error: "refused method"};
                        }
                    } else {
                        result = "Mot de passe incorrect";
                        result = {'code error': "403", error: "Wrong password"};
                    }
                }
            }
            console.log(result)
            res.json(result);
        });

        app.delete('/Session', async (req, res, next) => {
            let UserId;
            if (req.body.UserId != null) {
                UserId = req.body.UserId;
            } else {
                result = "UserId manquant";
                result = {'code error': "400", error: "UserId missing"}
            }

            if (UserId != null) {
                result = await query(`DELETE FROM Session WHERE UserId = ${mysql.escape(UserId)}`);
                if (result.length == 0) {
                    result = {'code error': "403", error: "refused method"};
                }
            }
            res.json(result);
        });
    }
}