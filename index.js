// CRPG207 Threaded Project for OOSD
// Team 4: Tallis MacDonald, Woody McBeath, Trevor Prosser

//Stating constants and node modules to load
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");

//Setting up EJS and setting paths
app.use(bodyParser.urlencoded({extended:true}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(express.static("media"));

// Connect to the travelexperts database
function getConnection() {
    let con = mysql.createConnection({
        host: 'localhost',
        user: 'admin',
        password: '',
        database: 'travelexperts'
    });
    return con;
}

//Stating variables for server
var port = 8000;
var server = app.listen(port, (err)=>{
    if (err) throw err;
    console.log("Server started on port " +port);
});

//404 page
app.use((req,res, next)=>{
    res.status(404).render("404");
});