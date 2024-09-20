
const getSessionIDs = require('../controllers/getSessionIDs');
const md5 = require('md5');

const Privilege = require('../Models/PrivilegeFeaturesModel');
const Role = require('../Models/RoleModel');
const GeneralFunction = require('../Models/GeneralFunctionModel');
const Department = require('../Models/DepartmentModel');
const User = require('../Models/UserModel');
const Document = require('../Models/DocumentModel');



const gf = new GeneralFunction();

module.exports = (socket, Database) => {
    socket.on('specific', async (browserblob) => {
        let param = browserblob.param;
        let melody1 = (browserblob.melody1) ? browserblob.melody1 : '';

        let session = getSessionIDs(melody1);
        let userID = session.userID;

        try {
            if (param === "") {
                socket.emit(melody1 + '_' + param, {
                    type: 'error',
                    message: 'Oops, something went wrong'
                });
            } else if (param === "specific_privilege") {
                let dataId = browserblob.dataId;
                const PrivilegeModel = new Privilege(Database, dataId);
                result = (await PrivilegeModel.getPrivileges()).privilegeColumns;
                socket.emit(melody1 + '_' + param, result);
            } else if (param === "get_user_privileges") {
                let user = browserblob.user;
                const PrivilegeModel = new Privilege(Database, user);
                let privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;
                socket.emit(md5(Number(user)) + '_' + param, privilegeData);
                socket.broadcast.emit(md5(Number(user)) + '_' + param, privilegeData);
            } else if (param === "specific_role") {
                const RoleModel = new Role(Database);
                let dataId = browserblob.dataId;
                result = await RoleModel.preparedFetch({
                    sql: 'roleID=?',
                    columns: [dataId]
                });
                if (Array.isArray(result)) {
                    socket.emit(melody1 + '_' + param, result[0]);
                } else {
                    socket.emit(melody1 + '_' + param, {
                        type: 'error',
                        message: 'Oops, something went wrong: Error => ' + result.sqlMessage
                    });
                }
            } else if (param === "specific_department") {
                const DepartmentModel = new Department(Database);
                let dataId = browserblob.dataId;
                result = await DepartmentModel.preparedFetch({
                    sql: 'departmentID=?',
                    columns: [dataId]
                });
                if (Array.isArray(result)) {
                    socket.emit(melody1 + '_' + param, result[0]);
                } else {
                    socket.emit(melody1 + '_' + param, {
                        type: 'error',
                        message: 'Oops, something went wrong: Error => ' + result.sqlMessage
                    });
                }
            } else if (param === "specific_user") {
                const UserModel = new User(Database);
                let dataId = browserblob.dataId;
                result = await UserModel.preparedLeftJoinFetch({
                    sql: 'userID=?',
                    columns: [dataId]
                });
                if (Array.isArray(result)) {
                    socket.emit(melody1 + '_' + param, result[0]);
                } else {
                    socket.emit(melody1 + '_' + param, {
                        type: 'error',
                        message: 'Oops, something went wrong: Error => ' + result.sqlMessage
                    });
                }
            } else if (param === "specific_document") {
                const DocumentModel = new Document(Database);
                let dataId = browserblob.dataId;
                result = await DocumentModel.preparedFetch({
                    sql: 'documentID=?',
                    columns: [dataId]
                });
                if (Array.isArray(result)) {
                    socket.emit(melody1 + '_' + param, result[0]);
                } else {
                    socket.emit(melody1 + '_' + param, {
                        type: 'error',
                        message: 'Oops, something went wrong: Error => ' + result.sqlMessage
                    });
                }
            } else if (param === "assign_department") {
                let departmentID = browserblob.departmentID;
                let newUserIDs = browserblob.hiddenID;
            
                // Check for empty
                let result = await gf.ifEmpty([departmentID]);
                if (result.includes('empty')) {
                    socket.emit(melody1 + '_assign_department', {
                        type: 'caution',
                        message: 'Select Department to continue!'
                    });
                } else {
                    const PrivilegeModel = new Privilege(Database, userID);
                    let privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;
            
                    if (privilegeData && privilegeData.pearson_specter && privilegeData.pearson_specter.assign_department == 'yes') {
                        const department = new Department(Database);
                        let updateResult = await department.appendUserIDs(departmentID, newUserIDs);
            
                        if (updateResult.affectedRows > 0) {
                            socket.emit(melody1 + '_' + param, {
                                type: 'success',
                                message: 'User assigned to department successfully'
                            });
                        } else if (updateResult.message === 'No new user IDs to add') {
                            socket.emit(melody1 + '_' + param, {
                                type: 'caution',
                                message: 'User already exist in the department'
                            });
                        } else {
                            socket.emit(melody1 + '_' + param, {
                                type: 'error',
                                message: 'Failed to assign User ID to department'
                            });
                        }
                    } else {
                        socket.emit(melody1 + '_' + param, {
                            type: 'caution',
                            message: 'You have no privilege to perform this task'
                        });
                    }
                }
            } else if (param === "assign_user") {
                let documentID = browserblob.hiddenID;
                let newUserIDs = browserblob.userID;
            
                // Check for empty
                let result = await gf.ifEmpty([newUserIDs]);
                if (result.includes('empty')) {
                    socket.emit(melody1 + '_assign_user', {
                        type: 'caution',
                        message: 'Select User to continue!'
                    });
                } else {
                    const PrivilegeModel = new Privilege(Database, userID);
                    let privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;
            
                    if (privilegeData && privilegeData.pearson_specter && privilegeData.pearson_specter.assign_user == 'yes') {
                        const document = new Document(Database);
                        let updateResult = await document.appendUserIDs(documentID, newUserIDs);
            
                        if (updateResult.affectedRows > 0) {
                            socket.emit(melody1 + '_' + param, {
                                type: 'success',
                                message: 'User assigned to document successfully'
                            });
                        } else if (updateResult.message === 'No new user IDs to add') {
                            socket.emit(melody1 + '_' + param, {
                                type: 'info',
                                message: 'User already assigned to the document'
                            });
                        } else {
                            socket.emit(melody1 + '_' + param, {
                                type: 'error',
                                message: 'Failed to assign User to document'
                            });
                        }
                    } else {
                        socket.emit(melody1 + '_' + param, {
                            type: 'caution',
                            message: 'You have no privilege to perform this task'
                        });
                    }
                }
            } else if (param === "updateProfile") {
                const UserModel = new User(Database);

                let ps_profile_hiddenid = browserblob.ps_profile_hiddenid;
                let ps_profile_first_name = browserblob.ps_profile_first_name;
                let ps_profile_last_name = browserblob.ps_profile_last_name;
                let ps_profile_phon = browserblob.ps_profile_phon;
                let ps_profile_email = browserblob.ps_profile_email;
                let ps_profile_address = browserblob.ps_profile_address;
                let ps_profile_password = browserblob.ps_profile_password;
                let ps_profile_confirm_password = browserblob.ps_profile_confirm_password;


                if (ps_profile_password != "" && ps_profile_password !== ps_profile_confirm_password) {
                    socket.emit(melody1 + '_updateProfile', {
                        type: 'caution',
                        message: 'Passwords do not match'
                    });
                }
            
                let result = await UserModel.updateTable({
                    sql: 'firstName = ?, lastName = ?, email = ?, phone = ?, address = ?, password = ? WHERE userID = ? AND status != ?',
                    columns: [ps_profile_first_name, ps_profile_last_name, ps_profile_email, ps_profile_phon, ps_profile_address, md5(ps_profile_password) ,ps_profile_hiddenid, 'i']
                });

                if (result && result.affectedRows !== undefined) {
                    socket.emit(melody1 + '_updateProfile', {
                        type: 'success',
                        message: 'User Profile Updated successfully'
                    });
                } else {
                    socket.emit(melody1 + '_updateProfile', {
                        type: 'error',
                        message: 'Failed to update profile'
                    });
                }

                console.log(result);
            }
        } catch (error) {
            socket.emit(melody1 + '_' + param, {
                type: 'error',
                message: 'mmmmmmmmmm: ' + error
            });
        }
    });
}
