const mysql = require("mysql");
const helper = require("../helper");
const bcrypt = require('bcryptjs');
module.exports = {
    initFunction: (app, query, bcrypt) => {
        app.get('/ProductMaterial', async (req, res, next) => {
            let checkData = true;
            let MaterialId, ProductId, result;

            if (req.query.MaterialId) {
                MaterialId = req.query.MaterialId;
            } else {
                checkData = false;
            }
            if (req.query.ProductId) {
                ProductId = req.querry.ProductId;
            } else {
                checkData = false
            }


            if (checkData) {
                result = await query(`SELECT ProductId, MaterialId FROM ProductMaterials WHERE ProductId = ${mysql.escape(ProductId)} AND MaterialId = ${mysql.escape(MaterialId)};`);
                if (result.length == 0) {
                    res.status(204).json({ succes: false, return: 'Not found' });
                }
            } else if (ProductId != null) {
                result = await query(`SELECT ProductId, MaterialId FROM ProductMaterials WHERE ProductId = ${mysql.escape(ProductId)};`);
                if (result.length == 0) {
                    res.status(204).json({ succes: false, return: 'Not found' });
                }
            } else if (MaterialId != null) {
                result = await query(`SELECT ProductId, MaterialId FROM ProductMaterials WHERE MaterialId = ${mysql.escape(MaterialId)};`);
                if (result.length == 0) {
                    res.status(204).json({ succes: false, return: 'Not found' });
                }
            } else {
                res.status(400).json({ succes: false, return: 'No product id (ProductId) or Material id (MaterialID) passed as parameter' });
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.post('/ProductMaterial', async (req, res, next) => {
            let checkData = true;
            let ProductId, MaterialId, result;

            if (req.body.MaterialId) {
                MaterialId = req.body.MaterialId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No material id (MaterialId) passed as parameter' });
            }
            if (req.nody.ProductId) {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No product id (ProductId) passed as parameter' });
            }

            if (checkData) {
                result = await query(`INSERT INTO ProductMaterials VALUE(${mysql.escape(ProductId), mysql.escape(MaterialId)});`);
                if (result == 0) {
                    res.status(403).json({ succes: false, return: 'refused method' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });

        app.delete('/ProductMaterial', async (req, res, next) => {
            let checkData = true;
            let ProductId, MaterialId, result;

            if (req.body.ProductId) {
                ProductId = req.body.ProductId;
            } else {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No product id (ProductId) passed as parameter' });
            }
            if (req.body.MaterialId) {
                checkData = false;
                res.status(400).json({ succes: false, return: 'No material id (MaterialId) passed as parameter' });
            }

            if (checkData) {
                result = await query(`DELETE FROM ProductMaterials WHERE ProductId = ${mysql.escape(ProductId)} AND MaterialId = ${mysql.escape(MaterialId)};`);
                if (result == 0) {
                    res.status(403).json({ succes: false, return: 'refused method"' });
                }
            }
            console.log(result);
            res.status(200).json({ succes: true, return: result });
        });
    }
}