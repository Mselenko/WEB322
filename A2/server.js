/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Margarita Selenko   Student ID: 147393169    Date: 10/1/18
*
* Online (Heroku) Link: https://salty-scrubland-12726.herokuapp.com/
*
********************************************************************************/ 


var express = require('express');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

var path = require('path');

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
    data_service.getAllEmployees()
    .then(data=>res.json(data))
    .catch(err => res.json({message: err}));
});

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