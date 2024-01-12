module.exports = {
    initFunction : (app, query) => {
        app.get('/Products', async (req, res, next) => {
            if (req.query.id) {
                let result = await query(`SELECT Name, Price, Description, Stock FROM Products WHERE ProductId = ${req.query.id}`);
                console.log(result)
                res.send(result)
            } else {
                let result = await query(`SELECT Name, Price, Description, Stock FROM Products`);
                console.log(result)
                res.send(result);
            }
        });

        app.post('/Products', async (req, res, next) => {
            let checkData = false, result, name, price, description, stock;

            if (req.body.name != null) {
                console.log(req.body.name.toLowerCase());
                name = req.body.name.toLowerCase();
            } else {
                checkData = true;
                result = "Aucun nom (name) passé en paramètre"
            }

            if (req.body.price != null) {
                console.log(req.body.price.toLowerCase());
                price = req.body.price.toLowerCase();
            } else {
                checkData = true;
                result = "Aucun prix (price) passé en paramètre"
            }

            if (req.body.description != null) {
                console.log(req.body.description.toLowerCase());
                description = req.body.description.toLowerCase();
            } else {
                checkData = true;
                result = "Aucune description passé en paramètre"
            }

            if (req.body.stock != null) {
                console.log(req.body.stock.toLowerCase());
                stock = req.body.stock.toLowerCase();
            } else {
                checkData = true;
                result = "Aucun stock passé en paramètre"
            }

            if (checkData == false) {
                result = await query(`INSERT INTO Products VALUES(${name}, ${price}, ${description}, ${stock});`);
                console.log(result)
                res.send(result)
            }
            else {
                console.log(result);
                res.send(result);
            }
        });

        app.put('/products', async (req, res, next) => {
            //A faire
        });

        app.delete('/Products', async (req, res, next) => {
            if (req.body.id != null) {
                let result = await query(`DELETE FROM Products WHERE ProductId = ${req.body.id};`);
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