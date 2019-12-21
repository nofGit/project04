const mysql= require('mysql');
let con; 

function openDb(app)
{
    return new Promise((resolve, reject)=>
    {
        con= mysql.createConnection({
            host:'localhost',
            user:'root',
            password:'',
            database:'myshopdb'
        })
        con.connect((err)=>
        {
            if(err)
            {
                con.end();
                reject(err);
            }
            else
            {
                app.set('CONNECTION', con);
                console.log('mysql is connect');
                resolve(true);
            }
        });
    });
}

module.exports= {openDb}