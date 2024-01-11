module.exports = {
    initFunction : (app, query) => {
        app.get('/Users', async (req, res, next) => { 
            if (req.query.id) {
                //getUsersID
                let result = await query(`SELECT Firstname, Lastname, Mail, Password, RoleId FROM Users WHERE UserId = ${mysql.escape(req.query.id)}`)
                console.log(result)
            }
            else {
                //GetUser
                let result = await query(`SELECT Firstname, Lastname, Mail, Password, RoleId FROM Users`)
                console.log(result)
                res.send(result)
            }
        });

        app.post('/Users', async (req, res, next) => {
            console.log(req.body?.nom?.toLowerCase());
        })        
    }
}