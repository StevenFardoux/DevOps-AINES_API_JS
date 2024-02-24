const mysql = require('mysql');
const {query} = require("express");

module.exports ={
    initFunction: (app, query) =>{
        app.post('/Materials', async (req, res)=>{
            try{
                const { Label } = req.body;
                const result = await query('INSERT INTO Materials (Label) VALUES (?)', [Label]);

                if (result.affectedRows === 1){
                    const newMaterial = await query('SELECT * FROM Materials WHERE MaterialId = ?', [result.insertId]);
                    res.json({ success : true, message: 'Materiels ajouter avec succes', material : newMaterial});
                }else {
                    res.status(500).json({success : false, message: 'Erreur lors de l\'ajout du materiels'})
                }
            }catch (error){
                console.error(error);
                res.status(500).json({success: false, error: 'Erreur lors de l\'ajout du materiels'})
            }
        });

        app.get('/Products/:id/material', async (req, res) =>{
            try{
                const MaterialId = req.params.id;
                const result = await query(`
                     SELECT * 
                     FROM Materials
                     WHERE MaterialId = ?`, [MaterialId]);
                res.json({success: true, data: result});
            }catch (error){
                console.error(error);
                res.status(500).json({ success: false, error: 'Erreur lors de la recuperation du materiel'})
            }
        });

        app.get('/Products/materials', async (req, res) => {
            try {
                const result = await query(`
            SELECT * 
            FROM Materials`);
                res.json({ success: true, data: result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Erreur lors de la récupération des matériaux' });
            }
        });

        app.delete('/Products/:id/material', async (req, res)=>{
            try{
                const MaterialId = req.params.id;

                const result = await query(`
                    DELETE 
                    FROM Materials
                    WHERE MaterialId = ?
                `, [MaterialId]);

                if (result.affectedRows === 0){
                    res.status(404).json({ success: false, error: 'Materiels non trouver'});
                }else{
                    res.json({success: true, error: 'Materiels supprimer avec succes'})
                }
            }catch (error){
                console.error(error);
                res.status(500).json({success: false, error: 'Erreur lors de la suppression'});
            }
        })


    }
}

