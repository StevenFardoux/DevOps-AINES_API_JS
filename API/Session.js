const mysql = require("mysql");
const { v4: uuidv4 } = require('uuid')

module.exports = {
    initFunction : (app, query) => {
        app.get('/Session', async (req, res, next) => {
            //getByToken
            let result;
            if (req.query.token != null) {
                result = await query(`SELECT UserId FROM Session WHERE token = ${mysql.escape(req.query.token)}`)
            } else {
                result = "Aucun token passé en paramètre";
            }
            console.log(result)
            res.send(result);
        });

        app.post('/Session', async (req, res, next) => {
            let checkData = false, mail, pwd, result, user;
            console.log(req.body)
            if (req.body.Mail != null) {
                mail = req.body.Mail;
            } else {
                checkData = true;
                result = "Adresse mail manquante";
            }

            if (req.body.Password != null) {
                pwd = req.body.Password;
            } else {
                checkData = true;
                result = "Mot de passe manquant";
            }

            
            if (checkData == false) {
                // check si le user existe bien.
                user = await query(`SELECT UserId FROM Users WHERE Mail = ${mysql.escape(mail)} AND Password = ${mysql.escape(pwd)};`);
                console.log(user)
                if (user.length == 0) {
                    result = "Aucun utilisateur trouvé";
                    console.log('test')
                } else {
                    let token = uuidv4();
                    result = await query(`SELECT id FROM Session WHERE token = '${token}'`);
                    while (result != "") {
                        console.log('token :' + token)
                        token = uuidv4();
                        result = await query(`SELECT id FROM Session WHERE token = '${token}'`);
                    }
                    console.log('token :' + token)
                    result = await query(`INSERT INTO Session VALUES(0, '${token}', ${user[0].UserId})`)
                }
            }
            console.log(result)
            res.send(result);
        });
    }
}