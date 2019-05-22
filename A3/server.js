/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Margarita Selenko   Student ID: 147393169    Date: 10/12/18
*
* Online (Heroku) Link: https://pacific-plains-50866.herokuapp.com/ 
*
********************************************************************************/ 


var express = require('express');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

var path = require('path');
var multer = require("multer");
const fs = require('fs');
var bodyParser = require('body-parser');

 
function onHttpStart(){
    console.log("Express http server listening on port: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

var data_service = require("./data-service.js");

app.get("/employees", function(req,res){
    if(req.query.status){
    data_service.getEmployeesByStatus(req.query.status)
    .then((data)=>{res.json(data);})
    .catch((err) => {res.json({message: err});});
    }else if(req.query.department){
    data_service.getEmployeesByDepartment(req.query.department)
    .then((data)=>{res.json(data);})
    .catch((err) => {res.json({message: err});});
    }else if(req.query.manager){
    data_service.getEmployeesByManager(req.query.manager)
    .then(data=>res.json(data))
    .catch(err => res.json({message: err}));
    }else{
        data_service.getAllEmployees()
        .then(data=>res.json(data))
        .catch(err => res.json({message: err}));
    }
    })

    <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a></li>
    <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Profile</a></li>
    <li role="presentation"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab">Messages</a></li>
    <li role="presentation"><a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">Settings</a></li>
</ul>

<!-- Tab panes -->
<div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="home"><br />home content</div>
    <div role="tabpanel" class="tab-pane" id="profile"><br />profile content</div>
    <div role="tabpanel" class="tab-pane" id="messages"><br />messages content</div>
    <div role="tabpanel" class="tab-pane" id="settings"><br />settings content</div>
</div>
    

app.get("/managers", function(req,res){
    data_service.getManagers()
    .then(data=>res.json(data))
    .catch(err => res.json({message: err}));
});

app.get("/departments", function(req,res){
    data_service.getDepartments()
    .then((data)=>res.json(data))
    .catch((err) => res.json({message: err}));
});


app.use(bodyParser.urlencoded({ extended: true }));

app.get("/employees/add", function(req,res){
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
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
        res.json({images:items});
    });
})

app.get("/images/add", function(req,res){
    res.sendFile(path.join(__dirname + "/views/addImage.html"));
});



app.get("/employee/:values", function(req,res){
    data_service.getEmployeeByNum(req.params.values)
    .then((data)=>{res.json(data);})
    .catch((err) => {res.json({message: err});});
})


app.use(function(req, res) 
{
    res.status(404).send("Page Not Found.");
});


data_service.initialize()
.then(function(){
    app.listen(HTTP_PORT,onHttpStart);
})
.catch(function(err){
    console.log(err);
})