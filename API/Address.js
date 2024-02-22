const mysql = require('mysql');

module.exports = {
    initFunction: (app, query) => {
        app.post('/Address', async (req, res, next) => {

            try{
                let checkData = false ,Name, Firstname, Lastname, Address2, City, Region, ZipCode, Country, Phone, Address1, UserId;

                console.log(req.body)
                if (req.body.Name != null) {
                    if(/^[A-Za-z]+$/.test(req.body.Name)){
                        console.log(req.body.Name.toLowerCase());
                        Name = req.body.Name.toLowerCase();
                    }
                    else{
                        checkData = true;
                        throw new Error("Le nom doit contenir que des lettre");
                    }
                } else {
                    checkData = true;
                    result =("Aucun nom (name) passé en paramètre");
                }

                if (req.body.Firstname != null) {
                    if(/^[A-Za-z]+$/.test(req.body.Firstname)){
                        console.log(req.body.Firstname.toLowerCase());
                        Firstname = req.body.Firstname.toLowerCase();
                    }
                    else{
                        checkData = true;
                        throw new Error("Le firstname doit contenir que des lettre");
                    }
                } else {
                    checkData = true;
                    throw new  Error ("Aucun firstname passé en paramètre");
                }

                if(req.body.Lastname != null){
                    if(/^[A-Za-z]+$/.test(req.body.Lastname)){
                        console.log(req.body.Lastname.toLowerCase());
                        Lastname = req.body.Lastname.toLowerCase();
                    }
                    else{
                        checkData = true;
                        throw new Error("Le lastname doit contenir que des lettre");
                    }
                }else{
                    checkData = true;
                    throw new Error ("Aucun lastname passé en paramètre")
                }

                if(req.body.Address2 != null){
                    console.log(req.body.Address2.toLowerCase());
                    Address2 = req.body.Address2.toLowerCase();
                }else{
                    checkData = true;
                    throw new Error ("Aucune addresse est passé en paramètre")
                }

                if (req.body.City != null){
                    console.log(req.body.City.toLowerCase());
                    City = req.body.City.toLowerCase();
                }else{
                    checkData = true;
                    throw new Error ("Aucune city est passé en paramètre")
                }

                if (req.body.Region != null){
                    console.log(req.body.Region.toLowerCase());
                    Region = req.body.Region.toLowerCase();
                }else {
                    checkData = true;
                    throw new Error ("Aucune region est passé en paramètre")
                }

                if(req.body.ZipCode != null){
                    if (/^\d+$/.test(req.body.ZipCode)){
                        console.log(req.body.ZipCode.toLowerCase());
                        ZipCode = req.body.ZipCode.toLowerCase();
                    }else {
                        checkData = true;
                        throw new Error ("le ZipCode doit contenir que des chiffre")
                    }
                }else{
                    checkData = true;
                    throw new Error ("Aucun zipcode est passé en paramètre")
                }

                if(req.body.Country != null){
                    console.log(req.body.Country.toLowerCase());
                    Country = req.body.Country.toLowerCase();
                }else{
                    checkData = true;
                    throw new Error ("Aucune country est passé en paramètre")
                }

                if (req.body.Phone != null){
                    console.log(req.body.Phone.toLowerCase());
                    Phone = req.body.Phone.toLowerCase();
                }else{
                    checkData = true;
                    throw new Error ("Aucun phone est passé en paramètre")
                }

                if (req.body.Address1 != null){
                    console.log(req.body.Address1.toLowerCase());
                    Address1 = req.body.Address1.toLowerCase();
                }else {
                    checkData = true;
                    throw new Error ("Aucune addresse1 est passé en paramètre")
                }

                if (req.body.UserId != null){
                    console.log(req.body.UserId.toLowerCase());
                    UserId = parseInt(req.body.UserId, 10);
                }else{
                    checkData = true;
                    throw new Error ("Aucune userid est passée en paramètre");
                }

                if (checkData === false) {
                    result = await query(`INSERT INTO Address(AddressId, Name, Firstname, Lastname, Address2, City, Region, ZipCode, Country,Phone, Address1, UserId) VALUES(0, ${mysql.escape(Name)}, ${mysql.escape(Firstname)},${mysql.escape(Lastname)}, ${mysql.escape(Address2)}, ${mysql.escape(City)}, ${mysql.escape(Region)}, ${mysql.escape(ZipCode)}, ${mysql.escape(Country)},${mysql.escape(Phone)}, ${mysql.escape(Address1)}, ${mysql.escape(UserId)});`);
                    console.log(result)
                    res.send(result)
                }
            }catch (error){
                console.error(error.message);
                res.status(400).json({error: error.message});
            }
        });
    }
}
