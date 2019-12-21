
const express = require('express');
const app = express();
const db = require('./db/db');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path  = require('path')
global.Application = app;

app.use(express.json());
app.use(cors());
db.openDb(app)
    .then((state) => {
        if (state) {
            console.log('data-base is connect');
        }
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.static('public'));

    app.post('/check_if_user_exist', ( req,res ) =>{
        let { user_id, user_password, email } = req.body
        const con = global.Application.get( 'CONNECTION' );
        const sql =  `select user_id , user_password, email FROM users WHERE user_id= ${user_id} or email = '${email}' `
        con.query( sql, ( err, result, fields ) =>{
            if( err ){
                res.json(err)
            }else{
                let isExsit =  result.length > 0 ? true :false ;
                res.json( {isExsit : isExsit , userId: user_id } );
            }
        })
    })

    


    app.get('/get_user_by_id/:user_id', ( req, res ) => {
        let { user_id } = req.params
        const con = global.Application.get( 'CONNECTION' );
        const sql =  `select user_id  FROM users WHERE user_id= ${user_id} `
        con.query( sql, ( err, result, fields ) =>{
            if( err ){
                res.json(err)
            }else{
                let isExsit =  result.length > 0 ? true :false ;
                res.json( {isExsit : isExsit , userId: user_id } );
            }
        })
    })


app.post('/sign_up', (req, res) => {
    const con = global.Application.get('CONNECTION');
    let { first_name, last_name, email, user_password, user_id, city, street } = req.body
    const sql = `INSERT INTO users(first_name, last_name, email, user_password, user_id, city, street) VALUES ('${first_name}', '${last_name}', '${email}', '${user_password}', ${user_id} , '${city}', '${street}')`
    con.query(sql, (err, result, fields) => {
        if (err) {
            if (err.errno === 1062) {
                res.json({ state: "err_SameId", message: ' ID already exsist' })
            } else {
                res.json(err)
            }
        }
        else {
            res.json(result);
        }
    })
});


app.post('/login', (req, res) => {
    let { email, user_password } = req.body;
    const con = app.get('CONNECTION');
    const sql = `select users.user_id as userId_users , users.admin , cart.cart_id as cartId_cart, orders.cart_id as cartId_orders
    from users 
    LEFT JOIN cart 
    ON users.user_id= cart.user_id
    LEFT JOIN orders
    ON users.user_id = orders.user_id
    where users.email = '${email}' and users.user_password = '${user_password}'
    ORDER BY cart.cart_date  DESC, orders.order_date DESC  `; 
    con.query(sql, (err, result, fields) => {
        if ( err ) {
            res.json( err )
        } else {
            if ( result[0] === undefined ) {
                res.json(  {success : false } )
            }
            else {
                    jwt.sign({
                        email: result[0].email, user_password: result[0].user_password, admin: result[0].admin
                    }, 'nofi', ( err, token ) => {
                        res.json( {success: true, token, admin: result[0].admin,  result: result[0] } )
                    })
                }
        }
    })
})

app.get('/admin' , varifyToken, (req,res)=>
{
    if(req.body.admin){
        res.json({state: 'success', message:'user details are ok- you can pass to admin component'})
    }else{
        res.json({state:'errordetails' , message:'you have no authorization'})
    }
} );


app.get('/main' , varifyToken, (req,res)=>
{
    if(!req.body.admin){
        res.json({state: 'success', message:'user details are ok- you can pass to main component'})
    }else{
        res.json({state:'errordetails' , message:'you have no authorization'})
    }
} )

app.get('/product_category' , (req,res)=>
{
    const con = global.Application.get('CONNECTION');
    const sql = `SELECT * FROM pruduct_category  `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result);
        }
    })
})

app.get('/products/:category_id', (req,res)=>{
    
    const con = global.Application.get('CONNECTION');
    const sql = `SELECT * FROM products where category_id = ${req.params.category_id} `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result);
        }
    })
})


app.get('/all_products', (req,res)=>{
    const con = global.Application.get('CONNECTION');
    const sql = ` SELECT products.product_id, products.product_name, products.category_id, products.price, products.product_picture , pruduct_category.category_name FROM products
    INNER JOIN pruduct_category
    ON products.category_id = pruduct_category.category_id `;

    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err);
        }
        else {            
            res.json(result);
        }
    })
})

app.get('/total_products' , (req,res)=>{
    const con = global.Application.get('CONNECTION');
    const sql = `  SELECT COUNT(*) as totalProducts FROM products `;
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result[0]);
        }
    })
})

app.get('/total_orders' , (req,res)=>{
    const con = global.Application.get('CONNECTION');
    const sql = `  SELECT COUNT(*) as totalOrders FROM orders  `;
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result[0]);
        }
    })
})



app.post('/add_product_to_cart', (req,res)=>{
    const con = global.Application.get('CONNECTION');
    const sql = ` INSERT INTO cart_item(product_id, category_id, quantity, total, cart_id) VALUES ( ${req.body.product.product_id}, ${req.body.product.category_id}, ${req.body.product.quantity}, ${req.body.product.price}*${req.body.product.quantity}, ${req.body.cartId}  )  `;
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result);
        }
    })
})


app.post('/create_cart' , (req,res)=>{
    let {userId}= req.body
    const con = global.Application.get('CONNECTION');
    const sql = `INSERT INTO cart( user_id) SELECT user_id FROM users WHERE user_id= ${userId} `;
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result);
        }
    })
})

app.get('/select_cart/:id' , (req,res)=>{
    const con = global.Application.get('CONNECTION');
    const sql = `SELECT cart_id, user_id FROM cart where user_id = ${req.params.id} order by cart_id desc `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result[0]);
        }
    })
})



app.get('/select_items_from_cart/:cartID', ( req, res )=>{
    let { cartID } = req.params
    const con = global.Application.get('CONNECTION');
        const sql = `SELECT products.product_id, products.price, products.product_name, products.product_picture, pruduct_category.category_name, cart_item.quantity, cart_item.total FROM cart_item
        INNER JOIN products
        ON cart_item.product_id = products.product_id
        INNER JOIN pruduct_category
        ON cart_item.category_id = pruduct_category.category_id
        WHERE cart_id = ${ cartID }
    `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result);
        }
    })

}) 


app.put('/update_quantity_on_cart' , ( req, res )=>{
    let { quantity ,  product_id , price} = req.body
    const con = global.Application.get('CONNECTION');
    const sql = `UPDATE cart_item SET quantity= ${quantity} , total= ${price}* ${quantity} WHERE product_id = ${product_id} `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result[0]);
        }
    })
})

app.delete('/delete_item_from_cart/:productId', (req,res )=>{
    let { productId } =  req.params
    const con = global.Application.get('CONNECTION');
    const sql = `DELETE FROM cart_item WHERE product_id = ${productId} `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result[0]);
        }
    })
})

app.delete('/delete_all_items_from_cart/:cartId' , ( req, res) =>{
    let {cartId} = req.params
    const con = global.Application.get('CONNECTION');
    const sql = `DELETE FROM cart_item WHERE cart_id = ${cartId} `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(result);
        }
    })
})

app.get('/get_shipping_dates' , (req,res)=>{
    const con = global.Application.get('CONNECTION');
    const sql = ` SELECT shipping_date , COUNT(*) as equalDates from orders GROUP BY shipping_date `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {       
            let datesArr= []  
            let respon= result
            for(let i= 0; i< respon.length; i++){
               let date= {shipping_date:  respon[i].shipping_date.toLocaleString(),
                    equalDates: respon[i].equalDates
                }
                datesArr.push(date)
            }
            res.json(datesArr);
        }
    })
})

app.post('/add_order' , ( req,res )=>{
    let { user_id, cart_id, total_price, shipping_city, shipping_street, shipping_date, last_4_dig } = req.body
    const con = global.Application.get('CONNECTION');
    const sql = ` INSERT INTO orders( user_id, cart_id, total_price, shipping_city, shipping_street, shipping_date,last_4_dig) VALUES ( ${user_id} , ${cart_id} , ${total_price} , '${shipping_city}' , '${shipping_street}' , '${shipping_date}' , ${last_4_dig} )`
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {            
            res.json(result);
        }
    })

})

app.get('/get_auto_user_data/:id', (req, res) =>{
    const con = global.Application.get('CONNECTION');
    const sql = `SELECT city ,street FROM users WHERE user_id = ${req.params.id} `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {            
            res.json(result[0]);
        }
    })

})


app.put('/update_product' , (req, res) =>{

    let { product_name ,  product_id , price , category_id , product_picture} = req.body
    const con = global.Application.get('CONNECTION');
    const sql = `UPDATE products SET product_name='${product_name}',category_id=${category_id}, price=${price},product_picture='${product_picture}' WHERE  product_id = ${product_id} `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {            
            res.json(result);
        }
    })
})

app.post('/add_new_product', (req,res)=>{
    let { product_name , price , category_id , product_picture} = req.body
    const con = global.Application.get('CONNECTION');
    const sql = `INSERT INTO products( product_name, category_id, price, product_picture) VALUES ('${product_name}',  ${category_id} , ${price} , '${product_picture}') `
    con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {            
            res.json(result);
        }
    })
}) 


app.post('/down_order' , (req,res) =>{
     const con = global.Application.get('CONNECTION');
    const sql = ` SELECT products.product_id, products.price, products.product_name, products.product_picture, pruduct_category.category_name, cart_item.quantity, cart_item.total , orders.order_id ,orders.total_price FROM cart_item
    INNER JOIN products
    ON cart_item.product_id = products.product_id
    INNER JOIN pruduct_category
    ON cart_item.category_id = pruduct_category.category_id
    INNER JOIN orders
    ON cart_item.cart_id = orders.cart_id
    WHERE orders.cart_id = ${ req.body.cartId }
    GROUP BY products.product_name
    ORDER BY pruduct_category.category_name
    `
        con.query(sql, (err, result, fields) => {
        if (err) {
            res.json(err)
        }
        else {
            let orderResult = result
            let receipt = `

              \n  order number ${ result[0]['order_id'] } :\n

                                \n   product name    quantity   price   total 
   ---------------------------------------------    
            `
            orderResult.map(p=>{
                receipt += ` \n 
    ${p.product_name}      ${p.quantity}     ${p.price}          ${p.price * p.quantity}
                `
            } )
            receipt += ` 
    --------------------------------------------
          \n   total price   = ${result[0].total_price}  `
            let pathname = process.cwd() + `\\public\\userReceipt${result[0]['order_id']}.txt` 
            fs.writeFile( pathname, receipt, (err) => {
                if (err) throw err
                res.json(`userReceipt${result[0]['order_id']}.txt`);
            })
        }
    })
})




function varifyToken(req, res, next ){
    const bearerHeader = req.headers['authorization']
    if(!bearerHeader){
        res.status(401).json( {state: 'err.error.message', message: 'token was not found' })
    }else{
        jwt.verify(bearerHeader, 'nofi', (err, authData)=>{
            if(err){
                res.status(403).json({ state: 'errToken', message: 'token is Illigal.' });
            }else{
            req.body.admin = authData.admin
            req.body.user_id = authData.user_id
            next()
            }
        } )
    }
}

            app.listen(3000, () => {
                console.log('running on 3000')
            })