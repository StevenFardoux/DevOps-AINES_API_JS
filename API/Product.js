const mysql = require("mysql");
const helper = require("../helper");

module.exports = {
    initFunction: (app, query) => {
        app.get('/Products', async (req, res, next) => {
            let trie = "", querr, result;

            if (req.query.Name) {
                if (trie != null) {
                    trie = ` WHERE P.Name LIKE %${mysql.escape(req.query.Name)}%`
                } else {
                    trie += ` AND P.Name LIKE %${mysql.escape(req.query.Name)}%`
                }
            }

            if (req.query.PriceMax) {
                let priceMin = 0
                if (req.query.PriceMin) {
                    priceMin = req.query.PriceMin
                }
                if (trie != null) {
                    trie = ` WHERE P.Price BETWEEN ${mysql.escape(priceMin)} AND ${mysql.escape(req.body.PriceMax)}`
                } else {
                    trie += ` AND P.Price = ${mysql.escape(priceMin)} AND ${mysql.escape(req.body.PriceMax)}`
                }
            }

            if (req.query.Stock) {

                if (trie != null) {
                    trie = ` WHERE P.Stock > 0 `
                } else {
                    trie += ` AND P.Stock > 0`
                }
            }

            if (req.query.Categories) {
                if (trie != null) {
                    trie = ` WHERE C.Name = ${mysql.escape(req.query.Categories)}`
                } else {
                    trie += ` AND C.Name = ${mysql.escape(req.query.Categories)}`
                }
            }

            if (req.query.Rooms) {
                if (trie != null) {
                    trie = ` WHERE R.Name = ${mysql.escape(req.query.Rooms)}`
                } else {
                    trie += ` AND R.Name = ${mysql.escape(req.query.Rooms)}`
                }
            }
            if (req.query.ProductId) {
                result = await query(`SELECT Name, Price, Description, Rate, Stock, CreateAt FROM Products WHERE ProductId = ${mysql.escape(req.query.ProductId)}`);
            } else {
                querr = `SELECT P.Name, Price, P.Description, Rate, Stock, CreateAt FROM Products P INNER JOIN Categoriser CT ON P.ProductId = CT.ProductId LEFT OUTER JOIN Categories C ON CT.CategoryId = C.CategoryId LEFT OUTER JOIN CategoriesRoom CR ON CR.CategoryId = C.CategoryId LEFT OUTER JOIN Rooms R ON CR.RoomId = R.RoomId `;
                if (trie != "") {
                    result = await query(querr + trie);
                } else {
                    result = await query(querr);
                }
                if (result.length == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result)
            res.status(200).json({ succes: false, return: result });

        });

        app.post('/Products', async (req, res, next) => {
            let checkData = false, result, tabUserInfo, name, price, description, rate, stock, createAt;
            if (req.headers.token != null) {
                tabUserInfo = helper.getInfoUser(req);
                if (tabUserInfo[0].UserID != 0) {
                    if (tabUserInfo[0].RoleId == 2) {
                        if (req.body.Name != null) {
                            console.log(req.body.Name.toLowerCase());
                            name = req.body.Name.toLowerCase();
                        } else {
                            checkData = true;
                            res.status(400).json({ succes: false, return: 'No first name (Mame) passed as parameter' });
                        }

                        if (req.body.Price != null) {
                            console.log(req.body.Price.toLowerCase());
                            price = req.body.Price.toLowerCase();
                        } else {
                            checkData = true;
                            res.status(400).json({ succes: false, return: 'No price (Price) passed as parameter' });
                        }

                        if (req.body.Description != null) {
                            console.log(req.body.Description.toLowerCase());
                            description = req.body.Description.toLowerCase();
                        } else {
                            checkData = true;
                            res.status(400).json({ succes: false, return: 'No first description (Description) passed as parameter' });
                        }

                        if (req.body.Rate != null) {
                            rate = req.body.rate;
                        }

                        if (req.body.Stock != null) {
                            console.log(req.body.Stock.toLowerCase());
                            stock = req.body.Stock.toLowerCase();
                        } else {
                            checkData = true;
                            res.status(400).json({ succes: false, return: 'No stock (Stock) passed as parameter' });
                        }

                        if (req.body.CreateAt != null) {
                            console.log(req.body.CreateAt);
                            createAt = req.body.CreateAt;
                        } else {
                            checkData = true;
                            res.status(400).json({ succes: false, return: 'No Date added (CreateAt) passed as parameter' });
                        }

                        if (checkData == false) {
                            result = await query(`INSERT INTO Products VALUES(0 ,${mysql.escape(name)}, ${mysql.escape(price)}, ${mysql.escape(description)}, ${(rate != null ? rate : 0)} , ${mysql.escape(stock)}, ${mysql.escape(createAt)});`);
                            if (result.length == 0) {
                                res.status(403).json({ succes: false, return: 'refused method' });
                            }
                        }
                    } else {
                        res.status(403).json({ succes: false, return: 'refused method' });
                    }
                } else {
                    res.status(204).json({ succes: false, return: 'Users not found' });
                }
            } else {
                res.status(403).json({ succes: false, return: 'Token required for this action' });
            }
            console.log(result)
            res.status(200).json({ succes: false, return: result });
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
            if (result.length == 0) {
                res.status(403).json({ succes: false, return: 'refused method' });
            }
            console.log(result);
            res.status(200).json({ succes: false, return: result });
        });

        app.delete('/Products', async (req, res, next) => {
            let result;
            if (req.body.ProductId != null) {
                result = await query(`DELETE FROM Products WHERE ProductId = ${mysql.escape(req.body.ProductId)};`);
                if (result.length == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            } else {
                res.status(400).json({ succes: false, return: 'No id (ProductId) passed as parameter' });
            }
            console.log(result);
            res.status(200).json({ succes: false, return: result });
        });
    }
}