
const User = require('../Models/UserModel');
const Session = require('../Models/SessionModel');
const Role = require('../Models/RoleModel');
const Privilege = require('../Models/PrivilegeFeaturesModel');
const Department = require('../Models/DepartmentModel');
const getSessionIDs = require('../controllers/getSessionIDs');
const path = require('path')
const md5 = require('md5');
const dotenv = require('dotenv')
dotenv.config({path: path.join(__dirname, `../../system.env`)})

module.exports = function (start, Database) {

    start.get('/dashboard', async function (request, response) {
        
        queryStr = request.query;
        const confiq = process.env

        if (confiq && confiq.DB_NAME && confiq.DB_NAME != '' || confiq.DB_NAME != undefined) {
            let session = getSessionIDs(queryStr.med);
            let userID = session.userID;
            let sessionID = session.sessionID;

            new User(Database);
            new Session(Database);
            new Role(Database);
            new Department(Database);
            
            if (md5(userID) == queryStr.pub) {
                const UserModel = new User(Database);
                let userResult = await UserModel.preparedFetch({
                    sql: 'userID = ?',
                    columns: [userID]
                });
                
                if (Array.isArray(userResult)) {
                    if (userResult.length > 0) {
                        const PrivilegeModel = new Privilege(Database, userID);
                        let privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;
                        let userDepartmentData = await UserModel.preparedFetchDepartment({
                            sql: 'userID = ?',
                            columns: [userID]
                        });
                            response.render('dashboard', {
                                pageNavigate: queryStr, 
                                userData: userResult[0],
                                department : (userDepartmentData.length) > 0 ?  userDepartmentData[0].department : '' ,
                                privilege: privilegeData,
                            });
                    } else {
                        console.log('Invalid user ID 3');
                        response.render('index', {pageNavigate: {error: 'loginError3'}, userResult: {}});
                    }
                } else {
                    console.log('Invalid user ID 2');
                    response.render('index', {pageNavigate: {error: 'loginError2'}});
                }
            } else {
                console.log('Invalid user ID 1');
                response.render('index', {pageNavigate: {error: 'loginError1'}});
            }
        } else {
            console.log('First error run');
        }
    });
}


String.prototype.shuffle = function () {
    var a = this.split(""), n = a.length;
    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}