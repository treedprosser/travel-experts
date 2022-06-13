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


//app.get to render the travel packages from database
app.get("/travelpackages", (req, res) => {
	let con = getConnection();
	con.connect((err) => {
		if (err) throw err;
		console.log("connection successful");
		con.query("select * from packages", (err, tpResult) => {
			if (err) throw err;
			res.render("travelpackages", {tpResult: tpResult});
			con.end((err) => {
				if (err) throw err;
			});
		});	
	});
});

// app.get to render the registration
app.get("/register", (req, res)=>{
    var con = getConnection();
	con.connect((err)=>{
		if(err) throw err;
		con.query("select AgentId, AgtFirstName, AgtLastName from agents", (err, result)=>{
			if(err) throw err;
            var agentsResult = result;
            var packageId = req.query.PackageId;
            con.query({sql:"select * from packages where PackageId=?", values:[packageId]}, (err, result)=>{
                if(err) throw err;
                var packageResult= result;
                //console.log(packageResult);
                res.render("register",{agentsResult:agentsResult, packageResult:packageResult});
                con.end((err)=>{
                    if(err) throw err;
                });
			});
		});
	});
});

app.post("/postregister", (req,res)=>{
	var con = getConnection();
	con.connect((err)=>{
		if(err) throw err;
		var sql = "INSERT INTO `customers`(`CustFirstName`, `CustLastName`, `CustAddress`, `CustCity`, `CustProv`, `CustPostal`, `CustCountry`, `CustHomePhone`, `CustBusPhone`, `CustEmail`, `AgentId`) VALUES (?)";
		var values = [req.body.CustFirstName, req.body.CustLastName, req.body.CustAddress, req.body.CustCity, req.body.CustProv, req.body.CustPostal, req.body.CustCountry, req.body.CustHomePhone, req.body.CustBusPhone, req.body.CustEmail, req.body.AgentId];
		con.query(sql,[values],(err,result, fields)=>{
			if(err) throw err;
			console.log("result="+ result.affectedRows);
			if (result.affectedRows)
			{
				//res.status(200).send(result.affectedRows + " row(s)inserted");
				res.redirect("/thanks?CustFirstName="+req.body.CustFirstName+"&CustLastName="+req.body.CustLastName);
			}else{
				res.status(200).send("insert unsuccessful");
			}
			con.end((err)=>{
				if(err) throw err;
			});
		});
	});
});

app.get("/thanks", (req,res)=>{
	res.render("thanks",{CustFirstName:req.query.CustFirstName, CustLastName:req.query.CustLastName});
});

//404 page
app.use((req,res, next)=>{
    res.status(404).render("404");
});