const getSessionIDs = require('../controllers/getSessionIDs');
const md5 = require('md5');

const GeneralFunction = require('../Models/GeneralFunctionModel');
const Privilege = require('../Models/PrivilegeFeaturesModel');
const SessionActivity = require('../Models/SessionModel');

const gf = new GeneralFunction();

module.exports = (socket, Database)=>{
    socket.on('privilege', async (browserblob)=>{
        let param = browserblob.param;
        let melody1 = (browserblob.melody1) ? browserblob.melody1 : '';

        let session = getSessionIDs(melody1);
        let userID = session.userID;
        let sessionID = session.sessionID;

        const PrivilegeModel = new Privilege(Database, userID);

        try {
            let privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;

            if(param === "") {
                socket.emit(melody1+'_'+param, {
                    type: 'error',
                    message: 'Oops, something went wrong'
                });
            } else if (param === "get_app_privileges") {
                if (privilegeData.pearson_specter.add_privilege == 'yes') {
                    let result = await PrivilegeModel.getFrontendPrivileges();
                    
                    socket.emit(melody1+'_'+param, result);
                } else {
                    socket.emit(melody1+'_'+param, {});
                }
            } else if (param === "set_one_privilege") {
                let table = browserblob.table;
                let columnName = browserblob.columnName;
                let dataValue = browserblob.dataValue;
                let category = browserblob.category;
                let user = browserblob.user;
                let group = browserblob.group;
                
                const SessionActivityModel = new SessionActivity(Database);

                if (user === "" || user === undefined ||  user === null ||  user === ' ') {
                    socket.emit(melody1+'_'+param, {
                        type: 'caution',
                        message: 'Select a User to assign this privilege'
                    });
                } else {
                    let accountID, activity_mssg, begin_mssg, add_mssg, message;
                    accountID = user;
                    activity_mssg = "user";
        
                    if (dataValue == "yes") {
                        begin_mssg = "Enabling";
                        add_mssg = "will make a user or group";
                    } else {
                        begin_mssg = "Disabling";
                        add_mssg = "will make the user or group unable to";
                    }
        
                    let title = columnName.replace(/_/g, ' ');
                    let splitData = columnName.replace(/_/g, ' ');
                    splitData = splitData.split(' ');
                    if (splitData[0] == 'update') {
                        message = begin_mssg+" '" + title.toUpperCase() + "' privilege "+add_mssg+" update contents";
                    } else if (splitData[0] == 'deactivate') {
                        message = begin_mssg+" '" + title.toUpperCase() + "' privilege "+add_mssg+" deactivate records from this functionality";
                    } else {
                        message = begin_mssg+" '" + title.toUpperCase() + "' privilege "+add_mssg+" create or add new records";
                    }

                    if (privilegeData.pearson_specter.add_privilege == "yes") {
                        result = await PrivilegeModel.updateSingleTable(table, columnName, dataValue, category, 'yes', accountID);
                        if (result.affectedRows) {
                            let activityID = gf.getTimeStamp();
                            result = await SessionActivityModel.insertTable([activityID, userID, gf.getDateTime(), 'updated a '+activity_mssg+' privilege']);
                            socket.emit(melody1+'_'+param, {
                                type: 'success',
                                message: message
                            });
                        } else {
                            socket.emit(melody1+'_'+param, {
                                type: 'error',
                                message: 'Oops, sorry something went wrong!'
                            });
                        }
                    } else {
                        socket.emit(melody1+'_'+param, {
                            type: 'caution',
                            message: 'You have no privilege to assign privileges !'
                        });
                    }
                }

            } else if (param === "set_all_privilege") {
                let table = browserblob.table;
                let group = browserblob.role;
                let user = browserblob.user;
                let dataValue = browserblob.dataValue;

                const SessionActivityModel = new SessionActivity(Database);

                if (group === "" && user === "" || group === undefined && user === undefined || group === null && user === null || group === ' ' && user === ' ') {
                    socket.emit(melody1+'_'+param, {
                        type: 'caution',
                        message: 'Select a Group or User to assign this privilege'
                    });
                } else {
                    let accountID = (user === "") ? group : user;

                    if (privilegeData.pearson_specter.add_privilege == "yes") {
                        //Update privilege
                        result = await PrivilegeModel.updateAllTableColumns(table, dataValue, accountID);
                        if (result.affectedRows) {
                            let activityID = gf.getTimeStamp();
                            result = await SessionActivityModel.insertTable([activityID, userID, gf.getDateTime(), 'updated a privilege']);

                            if (result.affectedRows) {
                                socket.emit(melody1+'_'+param, {
                                    type: 'success',
                                    message: 'User or Group will now be able to add new records, update records and delete records from the various functionalities checked'
                                });
                            } else {
                                socket.emit(melody1+'_'+param, {
                                    type: 'success',
                                    message: 'User or Group will now be able to add new records, update records and delete records from the various functionalities checked'
                                });
                            }
                        } else {
                            socket.emit(melody1+'_'+param, {
                                type: 'error',
                                message: 'Oops, sorry something went wrong!'
                            });
                        }
                    } else {
                        socket.emit(melody1+'_'+param, {
                            type: 'caution',
                            message: 'You have no privilege to assign privileges !'
                        });
                    }
                }
            } 
        } catch (error) {
            console.log(error);
            socket.emit(melody1+'_'+param, {
                type: 'error',
                message: error
            });
        }
    });
}