const mysql = require('mysql');

module.exports = {
    initFunction : (app, query) =>{
        app.post('/Categories', async (req, res)=>{
            try{
                const {Name} = req.body;
                const {Description} = req.body;
                const result = await query('INSERT INTO Categories (Name) (Description) VALUES (?)', [Name], [Description]);

                if (result.affectedRows === 1){
                    const newCategorie = await query('SELECT * FROM Categories WHERE CategoryId = ?', [result.insertId]);
                    res.json({ success : true, message : ' Categories bien ajouter', categorie : newCategorie});
                }else {
                    res.status(500).json({ success : false, message : 'Erreur lors de l\'ajout'})
                }
            }catch (error){
                console.error(error);
                res.status(500).json({success : false, error : 'Erroror lors de l\'ajout'});
            }
        })
    }
}