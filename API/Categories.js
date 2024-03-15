const mysql = require('mysql');

module.exports = {
    initFunction : (app, query) =>{
        app.post('/Categories', async (req, res) => {
            try {
                const { Name, Description } = req.body;
                const result = await query('INSERT INTO Categories (Name, Description) VALUES (?, ?)', [Name, Description]);

                if (result.affectedRows === 1) {
                    const newCategory = await query('SELECT * FROM Categories WHERE CategoryId = ?', [result.insertId]);
                    res.json({ success: true, message: 'Catégorie bien ajoutée', category: newCategory });
                } else {
                    res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout' });
            }
        });
    }
}
