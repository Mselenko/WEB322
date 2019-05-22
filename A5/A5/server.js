/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Margarita Selenko   Student ID: 147393169    Date: 11/16/18
*
* Online (Heroku) Link: https://warm-ridge-41956.herokuapp.com/
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

function onHttpStart() {
    console.log("Express http server listening on port: " + HTTP_PORT);
}

app.use(express.static('public'));


app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.get("/", function (req, res) {
    res.render('home')
});


app.get("/about", function (req, res) {
    res.render('about')

});

var data_service = require("./data-service.js");

app.get("/employees", function (req, res) {
    if (req.query.status) {
        data_service.getEmployeesByStatus(req.query.status)
            .then((data) => {
                if (data.length > 0) {
                    res.render("employees", { employees: data });
                } else {
                    res.render("employees", { message: "no results" })
                }
            })
            .catch(() => { res.render({ message: "no results" }); });
    } else if (req.query.department) {
        data_service.getEmployeesByDepartment(req.query.department)
            .then((data) => {
                if (data.length > 0) {
                    res.render("employees", { employees: data });
                } else {
                    res.render("employees", { message: "no results" })
                }
            })
            .catch(() => { res.render({ message: "no results" }); });
    } else if (req.query.manager) {
        data_service.getEmployeesByManager(req.query.manager)
            .then((data) => {
                if (data.length > 0) {
                    res.render("employees", { employees: data });
                } else {
                    res.render("employees", { message: "no results" })
                }
            })
            .catch(() => { res.render({ message: "no results" }); });
    } else {
        data_service.getAllEmployees()
            .then((data) => {
                if (data.length > 0) {
                    res.render("employees", { employees: data });
                } else {
                    res.render("employees", { message: "no results" });
                }
            })
            .catch(() => { res.render({ message: "no results" }); });
    }
})

app.get("/images/add", function (req, res) {
    res.render('addImage');

});

app.get("/employee/:empNum", (req, res) => {
    let viewData = {};
    data_service.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data;
        } else {
            viewData.employee = null;
        }
    }).catch(() => {
        viewData.employee = null;
    }).then(data_service.getDepartments)
        .then((data) => {
            viewData.departments = data;
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = [];
        }).then(() => {
            if (viewData.employee == null) {
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData });
            }
        });
});

app.get("/departments", function (req, res) {
    data_service.getDepartments()
        .then((data) => {
            if (data.length > 0) {
                res.render("departments", { departments: data });
            } else {
                res.render("departments", { message: "no results" });
            }
        })
        .catch(() => { res.render("departments", { message: "no results" }); });
});

app.get("/employees/add", function (req, res) {
    data_service.getDepartments(req.body)
        .then((data) => { res.render("addEmployee", { departments: data }); })
        .catch((err) => { res.render("addEmployee", { departments: [] }); });
})

app.get("/departments/add", function (req, res) {
    res.render('addDepartment')
});


app.get("/employees/delete/:empNum", (req, res) => {
    data_service.deleteEmployeeByNum(req.params.empNum)
        .then((data) => {
            res.redirect("/employees");
        })
        .catch((err) => {
            res.status(500).send("Unable to Remove Employee / Employee not found")
        })
});


app.get("/department/:departmentId", function (req, res) {
    data_service.getDepartmentById(req.params.departmentId)
        .then((data) => {
            if (data.length > 0) {
                res.render("department", { department: data });
            } else {
                res.status(404).send("Department Not Found");
            }
        })
        .catch((err) => { res.status(404).send("Department Not Found"); });
})


app.get("/departments/delete/:departmentId", function (req, res) {
    data_service.deleteDepartmentById(req.params.departmentId)
        .then(() => {
            res.redirect("/departments");
        })
        .catch(() => {
            res.status(500).send("Unable to Remove Department / Department not found")
        })
});


app.use(bodyParser.urlencoded({ extended: true }));




app.post("/employees/add", function (req, res) {
    data_service.addEmployee(req.body)
        .then(() => { res.redirect("/employees") })
        .catch((err) => {
            res.status(500).send("Unable to Add Employee");
        });

})

app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body)
        .then((data) => {
            res.redirect("/employees");
            console.log(req.body);
        })
        .catch((err) => {
            res.status(500).send("Unable to Update Employee");
        });
});



app.post("/departments/add", function (req, res) {
    data_service.addDepartment(req.body)
        .then(() => { res.redirect("/departments") })
        .catch((err) => {
            res.status(500).send("Unable to Add Department");
        });
})




app.post("/department/update", (req, res)=> {
    data_service.updateDepartment(req.body)
    .then((data)=>{
        res.redirect("/departments");
    })
    .catch((err)=>{
        console.log(err);
    })
});


const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", function (req, res) {
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render('images', { images: items })
    });
})





app.use(function (req, res) {
    res.status(404).send("Page Not Found.");
});


app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
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
    .then(function () {
        app.listen(HTTP_PORT, onHttpStart);
    })
    .catch(function (err) {
        console.log(err);
    })