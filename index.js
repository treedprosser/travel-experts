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
app.set("view engine", "ejs");
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

// app.get's to render the home page
app.get("/", (req,res)=>{
    res.render("index");
});
app.get("/index", (req,res)=>{
    res.render("index");
});

// app.get to render the contact information page and query the database
app.get("/contact", (req, res) => {
    let con = getConnection();
    con.connect((err) => {
        if (err) throw err;
        console.log("connection successful");
        con.query("select * from agencies", (err, result) => {
            if (err) throw err;
            con.query("select * from agents where AgencyId=1", (err, cgyResult) => {
                if (err) throw err;
                con.query("select * from agents where AgencyId=2", (err, okoResult) => {
                    if (err) throw err;
                    res.render("contact", { result: result, cgyResult: cgyResult, okoResult: okoResult });
                });
            });
        });
    });
});

// app.get to render the registration
app.get("/register", (req, res)=>{
    res.render("register");
});

// app.get to render the travel packages
app.get("/travelpackages", (req, res)=>{
    res.render("travelpackages");
});


//404 page
app.use((req,res, next)=>{
    res.status(404).render("404");
});