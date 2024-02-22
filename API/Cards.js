const mysql = require('mysql');

module.exports = {
    initFunction: (app, query) => {
        app.post('/Cards', async (req, res) => {
            try {
                let checkData = false, Name, CardNumber, CVV, ExpirationDate, UserId, resultat;

                console.log(req.body);

                if (req.body.Name != null) {
                    if(/^[A-Za-z]+$/.test(req.body.Name)){
                        console.log(req.body.Name.toLowerCase());
                        Name = req.body.Name.toLowerCase();
                    }
                    else{
                        checkData = true;
                        throw new Error("Ce champs doit contenir que des lettre");
                    }
                } else {
                    checkData = true;
                    throw new Error("Aucun nom passé en paramètre");
                }

                if (req.body.CardNumber != null) {
                    if (req.body.CardNumber.length < 16) {
                        throw new Error("Numero de carte incorrecte");
                    }
                    console.log(req.body.CardNumber.toLowerCase());
                    CardNumber = req.body.CardNumber.toLowerCase();
                } else {
                    checkData = true;
                    throw new Error("Aucun numéro de carte passé en paramètre");
                }

                if (req.body.CVV != null) {
                    if (req.body.CVV.length < 3) {
                        throw new Error("Cvv incorrecte");
                    } else {
                        console.log(req.body.CVV.toLowerCase());
                        CVV = req.body.CVV.toLowerCase();
                    }

                } else {
                    checkData = true;
                    throw new Error("Aucun CVV passé en paramètre");
                }

                if (req.body.ExpirationDate != null) {
                    console.log(req.body.ExpirationDate.toLowerCase());
                    ExpirationDate = req.body.ExpirationDate.toLowerCase();
                } else {
                    checkData = true;
                    throw new Error("Aucun date d'expiration passé en paramètre");
                }

                if (req.body.UserId != null) {
                    console.log(req.body.UserId.toLowerCase());
                    UserId = parseInt(req.body.UserId, 10);
                } else {
                    checkData = true;
                    throw new Error("Aucune userid est passée en paramètre");
                }

                if (checkData === false) {
                    resultat = await query(`INSERT INTO Cards(CardId, Name, CardNumber, CVV, ExpirationDate, UserId) VALUES(0, ?, ?, ?, ?, ?)`, [Name, CardNumber, CVV, ExpirationDate, UserId]);
                    console.log(resultat);
                    res.send(resultat);
                }
            } catch (error) {
                console.error(error.message);
                res.status(400).json({ error: error.message });
            }
        });
    }
};
