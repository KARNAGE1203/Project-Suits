const User = require('../Models/UserModel');
const Role = require('../Models/RoleModel');
const Privilege = require('../Models/PrivilegeFeaturesModel');
const Session = require('../Models/SessionModel');
const GeneralFunction = require('../Models/GeneralFunctionModel');
const getSessionIDs = require('../controllers/getSessionIDs');
const gf = new GeneralFunction();
const md5 = require('md5');

module.exports = (socket, Database) => {
    socket.on('insertNewUser', async (browserblob) => {
        let hiddenID = browserblob.ps_manage_user_hiddenid
        let firstName = browserblob.ps_user_firstName
        let lastName = browserblob.ps_user_lastName
        let email = browserblob.ps_user_email
        let phone = browserblob.ps_user_phone
        let address = browserblob.ps_user_address
        let username = browserblob.ps_user_username
        let password = browserblob.ps_user_password
        let confirm_password = browserblob.ps_user_confirm_password
        let roleID = browserblob.ps_user_role_dropdown
        let melody1 = browserblob.melody1;

        let session = getSessionIDs(melody1);
        let userID = session.userID;
        let sessionID = session.sessionID;

        if (md5(userID) == browserblob.melody2) {
            //Initiate connection
            const UserModel = new User(Database);
            //Check for empty
            let result = (hiddenID == "" || hiddenID == undefined) ? gf.ifEmpty([, username, password, confirm_password]) : gf.ifEmpty([username]);
            if (result.includes('empty')) {
                socket.emit(melody1 + '_insertNewUser', {
                    type: 'caution',
                    message: (hiddenID == "" || hiddenID == undefined) ? 'All fields are required' : 'Employee and username fields are required'
                });
            } else {
                const PrivilegeModel = new Privilege(Database, userID);
                let privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;
                
                let privilege = hiddenID == "" || hiddenID == undefined ? privilegeData.pearson_specter.add_user : privilegeData.pearson_specter.edit_user;
                if (privilege == "yes") {
                    let newuserID = hiddenID == "" || hiddenID == undefined ? 0 : hiddenID;
                    result = await UserModel.preparedFetch({
                        sql: 'username = ? AND userID != ? AND status = ?',
                        columns: [username, newuserID, 'active']
                    });
                    if (Array.isArray(result.length > 0)) {
                        socket.emit(melody1 + '_insertNewUser', {
                            type: 'error',
                            message: 'Sorry, username is being used by another person'
                        });
                    } else {
                        if (password != "" && password !== confirm_password) {
                            socket.emit(melody1 + '_insertNewUser', {
                                type: 'caution',
                                message: 'Passwords do not match'
                            });
                        } else {
                            if (hiddenID == "" || hiddenID == undefined) {
                                newuserID = gf.getTimeStamp();
                                result = await UserModel.insertTable([newuserID, firstName, lastName, email, phone, address, username, md5(password), roleID, gf.getDateTime(), 'a']);
                            } else {
                                result = await UserModel.updateTable({
                                    sql: 'firstName = ?, lastName = ?, email = ?, phone = ?, address = ?, roleID= ?, username=? ' + ((password == "" || password == undefined) ? '' : ', password=?') + ' WHERE userID=? AND status=?',
                                    columns: (password == "" || password == undefined) ? [firstName, lastName, email, phone, address, roleID, username, newuserID, 'a'] : [firstName, lastName, email, phone, address, roleID, username, md5(password), newuserID, 'a']
                                });
                            }
                            if (result && result.affectedRows !== undefined) {
                                const SessionModel = new Session(Database);
                                let activityid = gf.getTimeStamp();
                                //Insert or update user employee
                                if (hiddenID == "" || hiddenID == undefined) {
                                    if (result && result.affectedRows !== undefined) {
                                        let privilegeID = gf.getTimeStamp();
                                        result = await PrivilegeModel.insertTable(privilegeID, newuserID, 'user');
                                        if (result && result.affectedRows !== undefined) {
                                            result = await SessionModel.insertTable([activityid, userID, gf.getDateTime(), (hiddenID == "" || hiddenID == undefined) ? 'added a new user account' : 'updated a user account details']);
                                            let message = hiddenID == "" || hiddenID == undefined ? 'New User account has been created successfully' : 'User account has been updated successfully';
                                            if (result.affectedRows) {
                                                socket.broadcast.emit('userBroadcast', 'success broadcast');
                                                socket.emit(melody1 + '_insertNewUser', {
                                                    type: 'success',
                                                    message: message
                                                });
                                            } else {
                                                socket.emit(melody1 + '_insertNewUser', {
                                                    type: 'error',
                                                    message: 'Oops, something went wrong: Error1 => ' + result
                                                });
                                            }
                                        } else {
                                            socket.emit(melody1 + '_insertNewUser', {
                                                type: 'error',
                                                message: 'Oops, something went wrong: Error2 => ' + result
                                            });
                                        }
                                    } else {
                                        socket.emit(melody1 + '_insertNewUser', {
                                            type: 'error',
                                            message: 'Oops, something went wrong: Error3 => ' + result
                                        });
                                    }
                                } else {
                                    result = await SessionModel.insertTable([activityid, userID, gf.getDateTime(), (hiddenID == "" || hiddenID == undefined) ? 'added a new user account' : 'updated a user account details']);
                                    let message = hiddenID == "" || hiddenID == undefined ? 'New User account has been created successfully' : 'User account has been updated successfully';
                                    if (result.affectedRows) {
                                        socket.broadcast.emit('userBroadcast', 'success broadcast');
                                        socket.emit(melody1 + '_insertNewUser', {
                                            type: 'success',
                                            message: message
                                        });
                                    } else {
                                        socket.emit(melody1 + '_insertNewUser', {
                                            type: 'error',
                                            message: 'Oops, something went wrong: Error1 => ' + result
                                        });
                                    }
                                }
                            } else {
                                socket.emit(melody1 + '_insertNewUser', {
                                    type: 'error',
                                    message: 'Oops, something went wrong: Error4 => ' + result
                                });
                            }
                        }
                    }
                } else {
                    socket.emit(melody1 + '_insertNewUser', {
                        type: 'caution',
                        message: 'You have no privilege to add new user'
                    });
                }
            }
        } else {
            socket.emit(melody1 + '_insertNewUser', {
                'type': 'caution',
                'message': 'Sorry your session has expired, wait for about 18 secconds and try again...',
                'timeout': 'no'
            });
        }
    });
}