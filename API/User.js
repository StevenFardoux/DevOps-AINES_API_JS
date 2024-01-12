module.exports = {
    initFunction : (app, query) => {
        app.get('/Users', async (req, res, next) => { 
            if (req.query.id) {
                //getUsersID
                let result = await query(`SELECT Firstname, Lastname, Mail, Password, RoleId FROM Users WHERE UserId = ${mysql.escape(req.query.id)}`)
                console.log(result)
                res.send(result)
            }
            else {
                //GetUser
                let result = await query(`SELECT Firstname, Lastname, Mail, Password, RoleId FROM Users`)
                console.log(result)
                res.send(result)
            }
        });

        app.post('/Users', async (req, res, next) => {
            let checkData = false, result,  firstName, lastName, mail, pwd, roleId;

            if (req.body.firstName != null) {
                console.log(req.body.firstName.toLowerCase());
                firstName = req.body.firstName.toLowerCase();
            } else {
                checkData = true;
                result = "Aucun prénom (firstName) passé en paramètre"
                
            }

            if (req.body.lastName != null) {
                console.log(req.body.lastName.toLowerCase());
                lastName = req.body.lastName.toLowerCase();
            } else {
                checkData = true;
                result = "Aucun nom (lastName) passé en paramètre"
                
            }

            if (req.body.mail != null) {
                // Vérification que l'adresse mail est valide
                if (/^\S+@\S+\.\S+$/.test(req.body.mail)) {
                    mail = req.body.mail.toLowerCase();
                } else {
                    checkData = true;
                    result = "Adresse mail invalide"
                    

                }
            } else {
                checkData = true;
                result = "Aucun adresse mail (mail) passé en paramètre"
                
            }
            
            if (req.body.pwd != null) {
                //Vérification si le mdp est valide à faire
                pwd = req.body.pwd;
                if (pwd.length >= 8 && /[0-9]/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[!@#$%^&*]/.test(pwd)) {
                    // Le mot de passe est valide
                } else {
                    checkData = true;
                    result = "Le mot de passe doit contenir au moins 8 caractères, un chiffre, une majuscule et un caractère spécial";
                    
                }
            } else {
                checkData = true;
                result = "Aucun mot de passe (pwd) passé en paramètre"
                
            }

            if (req.body.roleId != null) {
                console.log(req.body.roleId.toLowerCase());
                roleId = req.body.roleId.toLowerCase();
            } else {
                checkData = true;
                result = "Aucun roleID passé en paramètre"
                
            }
            
            if (checkData == false) {
                //toute les données ont été envoyer alors ont peux créer le user.
                let result = await query(`ÌNSERT INTO Users VALUES(${firstName}, ${lastName}, ${mail} ${pwd}, ${roleId});`);
                console.log(result);
                res.send(result);
            }
            else {
                console.log(result);
                res.send(result);
            }
        });
        
        app.put('/Users', async (req, res, next)=> {
            let mail, pwd, checkData = false 

            if (req.body.mail != null) {
                //Vérification que c'est bien un mail avec retour false si ce ne l'est pas + message.4
                if (/^\S+@\S+\.\S+$/.test(req.body.mail)) {
                    mail = req.body.mail.toLowerCase();
                } else {
                    checkData = true;
                    let result = "Adresse mail invalide"
                    console.log(result)
                    res.send(result)

                }
            }

            if (req.body.pwd != null) {
                //Vérification que le mdp est valide, sinon retourne false avec message en conséquence.
                pwd = req.body.pwd;
                if (pwd.length >= 8 && /[0-9]/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[!@#$%^&*]/.test(pwd)) {
                    // Le mot de passe est valide
                } else {
                    checkData = true;
                    let result = "Le mot de passe doit contenir au moins 8 caractères, un chiffre, une majuscule et un caractère spécial";
                    console.log(result);
                    res.send(result);
                }
            }

            if (checkData != false) {
                let result = await query(`UPDATE Users SET`)
                if (req.body.firstName != null) {
                    result += ``
                    // A finir
                }
            }
        }) ;

        app.delete('/Users', async (req, res, next) => {
            if (req.body.id != null) {
                let result = await query(`DELETE FROM Users WHERE UserId = ${req.body.id};`);
                console.log(result);
                res.send(result);
            } else {
                result = "Aucun Id passé en paramètre"
                console.log(result);
                res.send(result);
            }
        });
    }
}