var employees =[];
var departments = [];
const fs = require('fs');

module.exports.initialize = function(){
    return new Promise(function(resolve, reject){
        
            fs.readFile("./data/employees.json", function(err,data){
                if(err){
                  reject("unable to read file"); return;
                }
                employees = JSON.parse(data);
            })
           
            fs.readFile("./data/departments.json", function(err,data){
                if(err){
                 reject("unable to read file"); return;
            }
            departments =JSON.parse(data);
            })
            
        resolve("read file successfully");
    })
};

module.exports.getAllEmployees = function(){
    return new Promise(function(resolve,reject){
        if(employees.length == 0){
            reject("no results returned");
        }else{
            resolve(employees);
        }
    })
}


module.exports.getManagers = function(){
    var new_array=[]
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject("no results returned");
        }else{
            for (let i =0;i<employees.length; i++){
                if(employees[i].isManager == true)
                new_array.push(employees[i]); 
            }
            if(new_array.length == 0){
                reject("no results returned");
            }
                resolve(new_array);
            }
           
        
    })
};

module.exports.getDepartments= function(){
    return new Promise(function(resolve, reject){
if(departments.length == 0){
reject("no results returned");
}else{
    resolve(departments);
}
})
}