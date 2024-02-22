const mysql = require('mysql');

module.exports = {
    initFunction: (app, query) => {
        // Récupération des couleurs avec le champ hex
        app.get('/Products/:id/colors', async (req, res) => {
            try {
                const idProduct = req.params.id;
                const result = await query(`
                    SELECT c.colorId, c.hex
                    FROM Colors c
                    JOIN ProductColors pc ON c.colorId = pc.colorId
                    WHERE pc.productId = ?
                `, [idProduct]);
                res.json({ success: true, data: result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Erreur récupération' });
            }
        });

        // Ajouter une couleur
        app.post('/Colors', async (req, res) => {
            try {
                const { hex } = req.body;

                // Vérifier si la couleur existe déjà
                const existingColor = await query('SELECT * FROM Colors WHERE hex = ?', [hex]);

                if (existingColor.length > 0) {
                    return res.status(400).json({ success: false, error: 'La couleur existe déjà' });
                }

                // Ajouter la nouvelle couleur
                const result = await query('INSERT INTO Colors (hex) VALUES (?)', [hex]);

                if (result.affectedRows === 1) {
                    const newColor = await query('SELECT * FROM Colors WHERE colorId = ?', [result.insertId]);
                    res.json({ success: true, message: 'Couleur ajoutée avec succès', color: newColor[0] });
                } else {
                    res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la couleur' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout de la couleur' });
            }
        });

        // Modifier la couleur
        app.put('/Products/:id/colors/:idCouleur', async (req, res) => {
            try {
                const idProduct = req.params.id;
                const idColor = req.params.idCouleur;

                const colorExist = await query(`
                    SELECT colorId, hex
                    FROM Colors
                    WHERE colorId = ?
                `, [idColor]);

                if (colorExist.length === 0) {
                    return res.status(404).json({ success: false, error: 'Couleur non trouvée' });
                }

                const result = await query(`
                    UPDATE ProductColors
                    SET colorId = ?
                    WHERE productId = ? AND colorId = ?
                `, [idColor, idProduct, idColor]);

                if (result.affectedRows === 0) {
                    res.status(404).json({ success: false, error: 'Couleur non trouvée pour ce produit' });
                } else {
                    res.json({ success: true, message: 'Couleur associée au produit modifiée avec succès', color: colorExist[0] });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Erreur lors de la modification de la couleur associée au produit' });
            }
        });

        // Supprimer une couleur
        app.delete('/Products/:id/colors/:idCouleur', async (req, res) => {
            try {
                const idProduct = req.params.id;
                const idColor = req.params.idCouleur;

                const result = await query(`
                    DELETE FROM ProductColors
                    WHERE productId = ? AND colorId = ?
                `, [idProduct, idColor]);

                if (result.affectedRows === 0) {
                    res.status(404).json({ success: false, error: 'Couleur non trouvée pour ce produit' });
                } else {
                    res.json({ success: true, message: 'Couleur supprimée avec succès' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la couleur du produit' });
            }
        });
    }
};
