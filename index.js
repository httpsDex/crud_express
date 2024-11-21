const express = require('express')
const app = express()
const moment = require('moment')
const mysql = require("mysql")
const cors = require('cors')
const bcrypt = require("bcrypt")

const PORT=process.env.PORT || 1804

const logger = (req,res,next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} : ${moment().format()}`)
    next()
}

app.use(logger)
app.use(cors())
app.use(express.json());

// connection to mysql
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"system_database"
})

//initilization of  connection
connection.connect()

//API
// Get request and response are the parameters
app.get("/api/get",(req,res) => {
    //creat a query
    connection.query("SELECT * FROM products",(err,rows,fields) => {
        //checking errror
        if(err) throw err
        //response 
        //key value pair
        res.json(rows)
    })
})

//api
//passing the id parameter
//request - >>> front end ID 
app.get("/api/request/:id",(req,res) => {
    const id=req.params.id
    connection.query(`SELECT * FROM products WHERE id=${id}`,(err,rows,fields) => {
        if(err) throw err
        if(rows.length > 0){
            res.json(rows)
        }else{
            res.status(400).json({msg: `${id} id is not found`})
        }
    })
    //res.send(id)
})



//post - create 
app.use(express.urlencoded({extended: false}))
app.post("/api/post",(req,res) => {
    const prodCode = req.body.prodCode
    const prodName = req.body.prodName
    const description = req.body.description
    const cost = req.body.cost
    const srp = req.body.srp
    const quantity = req.body.quantity

    connection.query(`INSERT INTO products (product_code,product_name,description,cost,	srp,quantity) VALUES ('${prodCode}','${prodName}','${description}','${cost}','${srp}','${quantity}')`,(err,rows,fields) => {
        if(err) throw  err
        res.json({msg: `Successfully Inserted`})
    })
})


//CRUD
//API
//PUT - UPDATE
app.use(express.urlencoded({ extended: false }))
app.put("/api/update:id", (req, res) => {
    console.log('Received PUT request for product ID:', req.params.id);
  const id = req.params.id
  const prodName = req.body.prodName
  const srp = req.body.srp
  

  connection.query(`UPDATE products SET product_name='${prodName}',srp='${srp}' WHERE id='${id}'`,(err, rows, fields) => {
      if (err) throw err
      res.json({ msg: `Successfully updated!` })
    }
  )
})


//delete api
app.use(express.urlencoded({extended: false}))
app.delete("/api/delete/:id",(req,res) => {
    const id=req.params.id
    connection.query(`DELETE FROM products  WHERE id='${id}'`,(err,rows,fields) => {
        if (err) throw err
        res.json({ msg: `Successfully Deleted`})
    })
})



//api for login 


app.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    

    connection.query(`SELECT * FROM user_credentials_tbl WHERE username ='${username}'`,(err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else if (results.length > 0) {
            res.json({
                success: true,
                message: 'LogIn Success',
                userType: results[0].userType
            });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});



app.listen(1804, () => {
    console.log(`Ang server ay tumatakbo na sa port na ${PORT}`)
})
