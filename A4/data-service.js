var employees = [];
var departments = [];
const fs = require('fs');

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {

        fs.readFile("./data/employees.json", function (err, data) {
            if (err) {
                reject("unable to read file"); return;
            }
            employees = JSON.parse(data);
        })

        fs.readFile("./data/departments.json", function (err, data) {
            if (err) {
                reject("unable to read file"); return;
            }
            departments = JSON.parse(data);
        })

        resolve("read file successfully");
    })
};


module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        if (employees.length == 0) {
            reject("no results returned");
        } else {
            resolve(employees);
        }
    })
}


module.exports.getManagers = function () {
    var new_array = []
    return new Promise(function (resolve, reject) {
        if (employees.length == 0) {
            reject("no results returned");
        } else {
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].isManager == true)
                    new_array.push(employees[i]);

            }
            if (new_array.length == 0) {
                reject("no results returned");
            }
            resolve(new_array);
        }
    })
};

module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        if (departments.length == 0) {
            reject("no results returned");
        } else {
            resolve(departments);
        }
    })
}


module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
    })
}


module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        var newEmployees = [];

        for (let i = 0; i < employees.length; i++) {
            if (employees[i].status == status)
                newEmployees.push(employees[i]);

        }
        if (newEmployees.length == 0)
            reject("no result returned");

        resolve(newEmployees);
    })
}


module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        var newEmployees = [];

        for (let i = 0; i < employees.length; i++) {
            if (employees[i].department == department)
                newEmployees.push(employees[i]);

        }
        if (newEmployees.length == 0)
            reject("no result returned");

        resolve(newEmployees);

    })
}


module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        var newEmployees = [];

        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == manager)
                newEmployees.push(employees[i]);

        }
        if (newEmployees.length == 0)
            reject("no result returned");

        resolve(newEmployees);

    })
}


module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var newEmployees = [];

        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num)
                newEmployees.push(employees[i]);

        }
        if (newEmployees.length == 0)
            reject("no result returned");

        resolve(newEmployees);

    })
}


module.exports.updateEmployee= function(employeeData){
    return new Promise(function(resolve,reject){
        var newEmployees = [];

        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == employeeData.employeeNum)
                employees[i]=employeeData;
        }
        if (employees.length == 0)
        reject("no result returned");

    resolve();
    })
}