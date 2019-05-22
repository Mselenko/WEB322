/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Margarita Selenko   Student ID: 147393169    Date: 11/02/18
*
* Online (Heroku) Link: https://blooming-mesa-80428.herokuapp.com/
*
********************************************************************************/ 


var express = require('express');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

var path = require('path');
var multer = require("multer");
const fs = require('fs');
var bodyParser = require('body-parser');

const exphbs = require('express-handlebars');
 
function onHttpStart(){
    console.log("Express http server listening on port: " + HTTP_PORT);
}

app.use(express.static('public'));


app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });
   

app.get("/", function(req,res){
  res.render('home')
});


app.get("/about", function(req,res){
    res.render('about')
       
});

var data_service = require("./data-service.js");

app.get("/employees", function(req,res){
    if(req.query.status){
    data_service.getEmployeesByStatus(req.query.status)
    .then((data)=>{res.render("employees",{employees: data});})
    .catch(() => {res.render({message: "no results"});});
    }else if(req.query.department){
    data_service.getEmployeesByDepartment(req.query.department)
    .then((data)=>{res.render("employees",{employees: data});})
    .catch(() => {res.render({message: "no results"});});
    }else if(req.query.manager){
    data_service.getEmployeesByManager(req.query.manager)
    .then((data)=>{res.render("employees",{employees: data});})
    .catch(() => {res.render({message: "no results"});});
    }else{
        data_service.getAllEmployees()
        .then((data)=>{res.render("employees",{employees: data});})
        .catch(() => {res.render({message: "no results"});});
    }
    })
    

app.get("/departments", function(req,res){
    data_service.getDepartments()
    .then((data)=>{res.render("departments", {departments: data});})
    .catch(() => {res.render({message: "no results"});});
});


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/employees/add", function(req,res){
    res.render('addEmployee')
  
});

app.post("/employees/add", function(req,res){
    data_service.addEmployee(req.body)
    .then(()=>{res.redirect("/employees")});
   
})

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({ storage: storage });

app.post("/images/add",upload.single("imageFile"),(req,res)=>{
    res.redirect("/images");
});

app.get("/images", function(req, res){
    fs.readdir("./public/images/uploaded", function(err, items) 
    {
        res.render('images', {images:items})
    });
})

app.get("/images/add", function(req,res){
    res.render('addImage');
 
});

app.get("/employee/:empNum", function(req,res){
    data_service.getEmployeeByNum(req.params.empNum)
    .then((data)=>{ res.render("employee", { employee: data });})
    .catch((err) => {res.render("employee",{message:"no results"});});
})

app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body)
    .then((data)=> {res.redirect("/employees");
    console.log(req.body);
})
    .catch((err) => {console.log("no results");});
   });
   

app.use(function(req, res) 
{
    res.status(404).send("Page Not Found.");
});


app.engine('.hbs', exphbs({
     extname: '.hbs',
     defaultLayout: 'main',
     helpers:{
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
           },

           equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }   
     }
 }));

app.set('view engine', '.hbs');

data_service.initialize()
.then(function(){
    app.listen(HTTP_PORT,onHttpStart);
})
.catch(function(err){
    console.log(err);
})