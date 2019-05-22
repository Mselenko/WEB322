const Sequelize = require('sequelize');

var sequelize = new Sequelize('d21nbbvu4toch3', 'dkyrfokjfwgmdz', 'a563e921e433612fc380aea31d219a0687e071a1b49c17bec2d56c73529fc8e2', {
    host: 'ec2-54-225-196-122.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING

}, {
        createdAt: false,
        updatedAt: false
    });


var Department = sequelize.define('Department', {
    departmentId:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
},
    {
        createdAt: false,
        updatedAt: false
    });


Department.hasMany(Employee, { foreignKey: 'department' });

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then((Employee) => {
                resolve();
            })
            .then((Department) => {
                resolve();
            })
            .catch((err) => {
                reject("unable to sync the database");
            });
    });
}
module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(() => {
                resolve(Employee.findAll());
            })
            .catch(() => {
                reject("no results returned.");
            });
    })
};


module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Department.findAll());
        })
            .catch(() => {
                reject("no results returned.");
            });
    });
}


module.exports.addEmployee = function (employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            for (let i in employeeData) {
                if (employeeData[i] == "")
                    employeeData[i] = null;
            }
            resolve(Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            }));
        }).catch(() => {
            reject("unable to add employee.");
        });
    }).catch(() => {
        reject("no results returned.");
    });
}


module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(function () {
                Employee.findAll({
                    where: { status: status }
                }).then(function (data) {
                    resolve(data);
                });
            })
            .catch(function (err) {
                reject("no results returned.");
            })
    });
}


module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(function () {
                Employee.findAll({
                    where: { department: department }
                }).then(function (data) {
                    resolve(data);
                });
            })
            .catch(function (err) {
                reject("no results returned.");
            })
    });
}


module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(function () {
                Employee.findAll({
                    where: { employeeManagerNum: manager }
                }).then(function (data) {
                    resolve(data);
                });
            })
            .catch(function (err) {
                reject("no results returned.");
            })
    });
}


module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
            .then(function () {
                Employee.findAll({
                    where: { employeeNum: num }
                }).then(function (data) {
                    resolve(data);
                });
            })
            .catch(function (err) {
                reject("no results returned.");
            })
    });
}


module.exports.updateEmployee = function (employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let i in employeeData) {
                if (employeeData[i] == "")
                    employeeData[i] = null;
            }

            resolve(Employee.update({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            }, { where: { employeeNum: employeeData.employeeNum } }));
        }).catch(() => {
            reject("unable to update employee.");
        });
    });
}


module.exports.addDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let x in departmentData) {
                if (departmentData[x] == "") {
                    departmentData[x] = null;
                }
            }
            Department.create({
                departmentName: departmentData.departmentName
            }).then(() => {
                resolve(Department);
            }).catch((err) => {
                reject("unable to create department.");
            });
        }).catch(() => {
            reject("unable to create department.");
        });
    });
}


module.exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Department.findAll({
                where: {
                    departmentId: id
                }
            }));
        }).catch((err) => {
            reject("unable to find department");
        });
    });
}

module.exports.deleteDepartmentById = function (id) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            resolve(Department.destroy({
                where: { departmentId: id }
            }));
        }).catch(function (err) {
            reject("deletion was rejected.");
        });
    });
}

module.exports.deleteEmployeeByNum = function (empNum) {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {
            resolve(Employee.destroy({
                where: { employeeNum: empNum }
            }));
        }).catch(function (err) {
            reject("deletion was rejected.");
        });
    });
}


module.exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let i in departmentData) {
                if (departmentData[i] == "")
                    departmentData[i] = null;
            }
            resolve(Department.update({
                departmentName: departmentData.departmentName,
            }, { where: { departmentId: departmentData.departmentId } }));
        }).catch(() => {
            reject("unable to update department.")
        });
    });
}