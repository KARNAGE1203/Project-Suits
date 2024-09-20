
const getSessionIDs = require('../controllers/getSessionIDs');
const md5 = require('md5');

const Role = require('../Models/RoleModel');
const Session = require('../Models/SessionModel');
const Privilege = require('../Models/PrivilegeFeaturesModel');
const GeneralFunction = require('../Models/GeneralFunctionModel');
const Department = require('../Models/DepartmentModel');
const User = require('../Models/UserModel');
const Document = require('../Models/DocumentModel');

const gf = new GeneralFunction();

module.exports = (socket, Database) => {
    socket.on('deactivate', async (browserblob) => {
        let param = browserblob.param;
        let melody1 = browserblob.melody1;

        let session = getSessionIDs(melody1);
        let userID = session.userID;
        let sessionid = session.sessionid;

        try {
            const PrivilegeModel = new Privilege(Database, userID);
            let privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;

            let message;

            if (param === "") {
                socket.emit(melody1 + '_' + param, {
                    type: 'error',
                    message: 'Oops, something went wrong'
                });
            } else {
                let result;
                if (param === "deactivate_department") {
                    const DepartmentModel = new Department(Database);
                    if (privilegeData !== undefined && privilegeData.pearson_specter.deactivate_department == "yes") {
                        let dataId = browserblob.dataId;
                        let checker = browserblob.checker == "deactivate" ? 'd' : 'a';
                        result = await DepartmentModel.updateTable({
                            sql: 'status=? WHERE departmentID=?',
                            columns: [checker, dataId]
                        });
                        if (result.affectedRows !== undefined) {
                            const SessionModel = new Session(Database);
                            let activityid = gf.getTimeStamp();
                            result = await SessionModel.insertTable([activityid, userID, gf.getDateTime(), (checker == "d") ? 'deactivated a department record' : 'reactivated a department record']);
                        } 
                    } else {
                        message = 'You have no privilege to perform this task!';
                    }
                } else if (param === "deactivate_role") {
                    const RoleModel = new Role(Database);
                    if (privilegeData !== undefined && privilegeData.pearson_specter.deactivate_role == "yes") {
                        let dataId = browserblob.dataId;
                        let checker = browserblob.checker == "deactivate" ? 'd' : 'a';
                        result = await RoleModel.updateTable({
                            sql: 'status=? WHERE roleID=?',
                            columns: [checker, dataId]
                        });
                        if (result.affectedRows !== undefined) {
                            const SessionModel = new Session(Database);
                            let activityid = gf.getTimeStamp();
                            result = await SessionModel.insertTable([activityid, userID, gf.getDateTime(), (checker == "d") ? 'deactivated a role record' : 'reactivated a role record']);
                        } 
                    } else {
                        message = 'You have no privilege to perform this task!';
                    }
                } else if (param === "deactivate_user") {
                    const UserModel = new User(Database);
                    if (privilegeData !== undefined && privilegeData.pearson_specter.deactivate_user == "yes") {
                        let dataId = browserblob.dataId;
                        let checker = browserblob.checker == "deactivate" ? 'd' : 'a';
                        result = await UserModel.updateTable({
                            sql: 'status=? WHERE userID=?',
                            columns: [checker, dataId]
                        });
                        if (result.affectedRows !== undefined) {
                            const SessionModel = new Session(Database);
                            let activityid = gf.getTimeStamp();
                            result = await SessionModel.insertTable([activityid, userID, gf.getDateTime(), (checker == "d") ? 'deactivated a user record' : 'reactivated a user record']);
                        } 
                    } else {
                        message = 'You have no privilege to perform this task!';
                    }
                } else if (param === "deactivate_document") {
                    const DocumentModel = new Document(Database);
                    if (privilegeData !== undefined && privilegeData.pearson_specter.deactivate_document == "yes") {
                        let dataId = browserblob.dataId;
                        let checker = browserblob.checker == "deactivate" ? 'd' : 'a';
                        result = await DocumentModel.updateTable({
                            sql: 'status=? WHERE documentID=?',
                            columns: [checker, dataId]
                        });
                        if (result.affectedRows !== undefined) {
                            const SessionModel = new Session(Database);
                            let activityid = gf.getTimeStamp();
                            result = await SessionModel.insertTable([activityid, userID, gf.getDateTime(), (checker == "d") ? 'deactivated a document record' : 'reactivated a document record']);
                        } 
                    } else {
                        message = 'You have no privilege to perform this task!';
                    }
                }
                if (message == undefined) {
                    message = result.affectedRows ? 'deactivate successful' : 'deactivate unsuccessful';
                }
                socket.emit(melody1 + '_' + param, {
                    type: (result.affectedRows) ? 'success' : 'caution',
                    message: message
                });
            }
        } catch (error) {
            // console.log(error);
            socket.emit(melody1 + '_' + param, {
                type: 'error',
                message: error
            });
        }
    });
}