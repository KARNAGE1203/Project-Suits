const Role = require('../Models/RoleModel');
const Privilege = require('../Models/PrivilegeFeaturesModel');
const Session = require('../Models/SessionModel');
const GeneralFunction = require('../Models/GeneralFunctionModel');
const getSessionIDs = require('../controllers/getSessionIDs');
const gf = new GeneralFunction();
const md5 = require('md5');

module.exports = (socket, Database)=>{
    socket.on('insertNewRole', async (browserblob)=>{
        let hiddenid = browserblob.ps_manage_role_hiddenid;
        let name = browserblob.ps_manage_role_name;
        let description = browserblob.ps_role_description;

        let melody1 = browserblob.melody1;

        let session = getSessionIDs(melody1);
        let userID = session.userID;

        if (browserblob.melody2) {
            //Initiate connection
            const RoleModel = new Role(Database);
            const PrivilegeModel = new Privilege(Database, userID);

            //Check for empty
            let result = await gf.ifEmpty([name]);
            if (result.includes('empty')) {
                socket.emit(melody1+'_insertNewRole', {
                    type: 'caution',
                    message: 'Enter role name!'
                });
            } else {
                let privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;
                
                let privilege;
                if (hiddenid == "" || hiddenid == undefined) {
                    privilege = privilegeData.pearson_specter.add_role;
                } else {
                    privilege = privilegeData.pearson_specter.edit_role;
                }
                if (privilege == "yes") {
                    let roleID = hiddenid == "" || hiddenid == undefined ? 0 : hiddenid;
                    result = await RoleModel.preparedFetch({
                        sql: 'role = ? AND roleID != ? AND status =?',
                        columns: [name, roleID, 'a']
                    });
                    if (Array.isArray(result)) {
                        if (result.length > 0) {
                            socket.emit(melody1+'_insertNewRole', {
                                type: 'caution',
                                message: 'Sorry, same role name exist'
                            });
                        } else {
                            if (hiddenid == "" || hiddenid == undefined) {
                                roleID = gf.getTimeStamp();
                                result = await RoleModel.insertTable([roleID, name, description, gf.getDateTime(), 'a']);
                            } else {
                                result = await RoleModel.updateTable({
                                    sql: 'role = ?, description = ? WHERE roleID = ? AND status = ?',
                                    columns: [name, description, roleID, 'a']
                                });
                            }
                            if (result.affectedRows !== undefined) {
                                const SessionModel = new Session(Database);
                                let activityid = gf.getTimeStamp();
                                result = await SessionModel.insertTable([activityid, userID, gf.getDateTime(), (hiddenid == "" || hiddenid == undefined) ? 'added a new role' : 'updated a role record']);
                                let message = hiddenid == "" || hiddenid == undefined ? 'Role has been created successfully' : 'Role has been updated successfully';
                                if (result.affectedRows) {
                                    socket.emit(melody1+'_insertNewRole', {
                                        type: 'success',
                                        message: message
                                    });
                                } else {
                                    socket.emit(melody1+'_insertNewRole', {
                                        type: 'error',
                                        message: 'Oops, something went wrong4: Error => '+result.toString()
                                    });
                                }
                            } else {
                                socket.emit(melody1+'_insertNewRole', {
                                    type: 'error',
                                    message: 'Oops, something went wrong3: Error => '+result.toString()
                                });
                            }
                        }
                    } else {
                        socket.emit(melody1+'_insertNewRole', {
                            type: 'error',
                            message: 'Oops, something went wrong2: Error => '+result.toString()
                        });
                    }
                } else {
                    socket.emit(melody1+'_insertNewRole', {
                        type: 'caution',
                        message: 'You have no privilege to add new role'
                    });
                }
            }
        } else {
            socket.emit(melody1+'_insertNewRole', {
                'type': 'caution',
                'message': 'Sorry your session has expired, wait for about 18 secconds and try again...',
                'timeout': 'no'
            });
        }
    });
}