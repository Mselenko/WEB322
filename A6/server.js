/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Margarita Selenko   Student ID: 147393169    Date: 12/2/18
*
* Online (Heroku) Link: https://powerful-caverns-25647.herokuapp.com/ 
*
********************************************************************************/


var HTTP_PORT = process.env.PORT || 8080;
var express = require('express');
const exphbs = require('express-handlebars');
var app = express();
const path = require('path');
const multer = require('multer');

var fs = require('fs');
const bodyParser = require('body-parser');
const data_service = require('./data-service.js');
const dataServiceAuth = require('./data-service-auth.js');
const clientSessions = require('client-sessions');



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

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });

app.use(express.static('./public'));

app.use(clientSessions({
    cookieName: "session",
    secret: "web322_assignment6",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));


app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
};


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent');

    dataServiceAuth.checkUser(req.body)
        .then((user) => {
            req.session.user = {
                userName: user.userName,
                email: user.email,
                loginHistory: user.loginHistory
            }

            res.redirect('/employees');

        }).catch((err) => {
            res.render('login', { errorMessage: err, userName: req.body.userName });
        });
});


app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    dataServiceAuth.registerUser(req.body)
        .then((value) => {
            res.render('register', { successMessage: "User created" });
        }).catch((err) => {
            res.render('register', { errorMessage: err, userName: req.body.userName });
        })
});


app.get('/userHistory', ensureLogin, (req, res) => {
    res.render('userHistory');
})


app.get("/employees", ensureLogin, function (req, res) {
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


app.get("/departments", ensureLogin, function (req, res) {
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


app.post("/department/update", ensureLogin, (req, res) => {
    data_service.updateDepartment(req.body)
        .then((data) => {
            res.redirect("/departments");
            console.log(req.body);
        })
        .catch((err) => { console.log("no results"); });
});


app.get("/department/:departmentId", ensureLogin, function (req, res) {
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

app.get("/departments/delete/:departmentId", ensureLogin, function (req, res) {
    data_service.deleteDepartmentById(req.params.departmentId)
        .then(() => {
            res.redirect("/departments");
        })
        .catch(() => {
            res.status(500).send("Unable to Remove Department / Department not found")
        })
});


app.get("/employees/add", ensureLogin, function (req, res) {
    data_service.getDepartments(req.body)
        .then((data) => { res.render("addEmployee", { departments: data }); })
        .catch((err) => { res.render("addEmployee", { departments: [] }); });
})


app.post("/employees/add", ensureLogin, function (req, res) {
    data_service.addEmployee(req.body)
        .then(() => { res.redirect("/employees") })
        .catch((err) => {
            res.status(500).send("Unable to Add Employee");
        });

})

app.get("/departments/add", ensureLogin, function (req, res) {
    res.render('addDepartment')
});

app.post("/departments/add", ensureLogin, function (req, res) {
    data_service.addDepartment(req.body)
        .then(() => { res.redirect("/departments") })
        .catch((err) => {
            res.status(500).send("Unable to Add Department");
        });
})


app.post("/images/add", upload.single("imageFile"), ensureLogin, (req, res) => {
    res.redirect("/images");
});

app.get("/images", ensureLogin, function (req, res) {
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render('images', { images: items })
    });
})

app.get("/images/add", ensureLogin, function (req, res) {
    res.render('addImage');

});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
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

app.post("/employee/update", ensureLogin, (req, res) => {
    data_service.updateEmployee(req.body)
        .then((data) => {
            res.redirect("/employees");
            console.log(req.body);
        })
        .catch((err) => {
            res.status(500).send("Unable to Update Employee");
        });
});


app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
    data_service.deleteEmployeeByNum(req.params.empNum)
        .then((data) => {
            res.redirect("/employees");
        })
        .catch((err) => {
            res.status(500).send("Unable to Remove Employee / Employee not found")
        })
});


app.use(function (req, res) {
    res.status(404).send("Page Not Found.");
});


dataServiceAuth.initialize()
    .then(dataServiceAuth.initialize)
    .then(() => {
        app.listen(HTTP_PORT, function () {
            console.log("app listening on: " + HTTP_PORT)
        });
    }).catch((err) => {
        console.log("unable to start server: " + err);
    })