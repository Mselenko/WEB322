/*********************************************************************************
* WEB322 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Margarita Selenko   Student ID: 147393169   Date: 9/7/18
*
* Online (Heroku) URL:   https://mighty-bastion-49598.herokuapp.com/
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();


app.get("/", (req, res) => {
    res.send("Margarita Selenko - 147393169");
});


app.listen(HTTP_PORT);