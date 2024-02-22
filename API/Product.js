const mysql = require("mysql");
const helper = require("../helper");



module.exports = {
    initFunction : (app, query) => {
        app.get('/Products', async (req, res, next) => {
            if (req.query.ProductId) {
                let result = await query(`SELECT Name, Price, Description, Stock, CreateAt FROM Products WHERE ProductId = ${mysql.escape(req.query.ProductId)}`);
            } else {
                let result = await query(`SELECT Name, Price, Description, Stock, CreateAt FROM Products`);
            }
            console.log(result)
          
            res.send(result);

        });

        app.post('/Products', async (req, res, next) => {
            let checkData = false, result, tabUserInfo, name, price, description, stock, createAt;
            if (req.headers.token != null) {
                tabUserInfo = helper.getInfoUser(req);
                if (tabUserInfo[0].UserID != 0) {
                    if (tabUserInfo[0].RoleId == 2) {
                        if (req.body.Name != null) {
                            console.log(req.body.Name.toLowerCase());
                            name = req.body.Name.toLowerCase();
                        } else {
                            checkData = true;
                            result = "Aucun nom (Name) passé en paramètre"
                        }

                        if (req.body.Price != null) {
                            console.log(req.body.Price.toLowerCase());
                            price = req.body.Price.toLowerCase();
                        } else {
                            checkData = true;
                            result = "Aucun prix (Price) passé en paramètre"
                        }

                        if (req.body.Description != null) {
                            console.log(req.body.Description.toLowerCase());
                            description = req.body.Description.toLowerCase();
                        } else {
                            checkData = true;
                            result = "Aucune description passé en paramètre"
                        }

                        if (req.body.Stock != null) {
                            console.log(req.body.Stock.toLowerCase());
                            stock = req.body.Stock.toLowerCase();
                        } else {
                            checkData = true;
                            result = "Aucun stock passé en paramètre"
                        }

                        if (req.body.CreateAt != null) {
                            console.log(req.body.CreateAt);
                            createAt = req.body.CreateAt;
                        } else {
                            checkData = true;
                            result = "Aucune Date d'ajoute (CreateAt) passé en paramètre"
                        }

                        if (checkData == false) {
                            result = await query(`INSERT INTO Products VALUES(0 ,${mysql.escape(name)}, ${mysql.escape(price)}, ${mysql.escape(description)}, ${mysql.escape(stock)}, ${mysql.escape(createAt)});`);
                        }
                    } else {
                        result = "Action non autorisé";
                    }
                } else {
                    result = "Aucun user trouvé"
                }
            } else {
                result = "Token necessaire pour cette action";
            }
            console.log(result)
            res.send(result)
        });

        app.put('/products', async (req, res, next) => {
            let quer = `UPDATE Products SET `;
            for (const key in req.body) {
                if (Object.hasOwnProperty.call(req.body, key)) {
                    if (key != 'ProductId') {
                        const value = req.body[key];
                        quer += ` ${key} = ${mysql.escape(value)}, `
                    }
                }
            }
            quer = quer.substring(0, quer.length - 2);
            quer += ` WHERE ProductId = ${mysql.escape(req.body.ProductId)};`;
            console.log(quer);
            let result = await query(quer);
            console.log(result);
            res.send(result);
        });

        app.delete('/Products', async (req, res, next) => {
            if (req.body.ProductId != null) {
                let result = await query(`DELETE FROM Products WHERE ProductId = ${mysql.escape(req.body.ProductId)};`);
                console.log(result);
                res.send(result);
            } else {
                result = "Aucun Id passé en parèmetre"
                console.log(result);
                res.send(result);
            }
        })
    }
}