const getsessionIDs = require('../getSessionIDs');
const md5 = require('md5');

const Privilege = require('../../Models/PrivilegeFeaturesModel');
const GeneralFunction = require('../../Models/GeneralFunctionModel');
const gf = new GeneralFunction();

const PearsonSpectorRptApi = require('../PearsonSpectorRptApi');
const PearsonSpectorRptApiModel = new PearsonSpectorRptApi();


module.exports = (socket, Database) => {
    socket.on('runPSReport', async (browserblob) => {
        let param = browserblob.param;
        let melody1 = (browserblob.melody1) ? browserblob.melody1 : '';

        let session = getsessionIDs(melody1);
        let userID = session.userID;
        let sessionID = session.sessionID;

        try {
            const PrivilegeModel = new Privilege(Database, userID);
            let privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;

            if (param === "") {
                socket.emit(melody1 + '_' + param, {
                    type: 'error',
                    message: 'Oops, something went wrong'
                });
            } else if (param === "login_report") {
                if (privilegeData !== undefined && privilegeData.pearson_specter.login_report == "yes") {
                    let user = browserblob.user;
                    let date_range = browserblob.date_range.split("**");

                    if (date_range.length < 1 || date_range.length == 0) {
                        socket.emit(melody1 + '_' + param, {
                            type: 'caution',
                            message: 'Pick a date range to run report'
                        });
                    } else {
                        let start_date = date_range[0], end_date = date_range[1];
                        if (user == "" || user == undefined || user == null) {
                            sql = 'activity LIKE ? AND dateTime BETWEEN ? AND ? ORDER BY dateTime ASC';
                            columns = ['%logged in%', start_date, end_date]
                        } else {
                            sql = 'userID=? AND activity LIKE ? AND dateTime BETWEEN ? AND ?  ORDER BY dateTime ASC';
                            columns = [user, '%logged in%', start_date, end_date,]
                        }

                        let result = await PearsonSpectorRptApiModel.getSessionRecords(Database, {
                            sql: sql,
                            columns: columns
                        });

                        socket.emit(melody1 + '_' + param, {
                            data: result,
                            reportType: (user == "" || user == undefined || user == null) ? 'date' : 'user'
                        });
                    }
                } else {
                    socket.emit(melody1 + '_' + param, {
                        type: 'caution',
                        message: 'You have no privilege to run this report!'
                    });
                }
            } else if (param === "recent_activity_report") {
                if (privilegeData !== undefined && privilegeData.pearson_specter.recent_activity_report == "yes") {
                    let user = browserblob.user;
                    let date_range = browserblob.date_range.split("**");

                    if (date_range.length < 1 || date_range.length == 0) {
                        socket.emit(melody1 + '_' + param, {
                            type: 'caution',
                            message: 'Pick a date range to run report'
                        });
                    } else {
                        let start_date = date_range[0], end_date = date_range[1];
                        if (user == "" || user == undefined || user == null) {
                            sql = 'dateTime BETWEEN ? AND ? ORDER BY dateTime ASC';
                            columns = [start_date, end_date]
                        } else {
                            sql = 'userID=? AND dateTime BETWEEN ? AND ?  ORDER BY dateTime ASC';
                            columns = [user, start_date, end_date,]
                        }

                        let result = await PearsonSpectorRptApiModel.getSessionRecords(Database, {
                            sql: sql,
                            columns: columns
                        });

                        socket.emit(melody1 + '_' + param, {
                            data: result,
                            reportType: (user == "" || user == undefined || user == null) ? 'date' : 'user'
                        });
                    }
                } else {
                    socket.emit(melody1 + '_' + param, {
                        type: 'caution',
                        message: 'You have no privilege to run this report!'
                    });
                }
            } else if (param === "deactivation_report") {
                if (privilegeData !== undefined && privilegeData.pearson_specter.deactivation_report == "yes") {
                    let user = browserblob.user;
                    let date_range = browserblob.date_range.split("**");

                    if (date_range.length < 1 || date_range.length == 0) {
                        socket.emit(melody1 + '_' + param, {
                            type: 'caution',
                            message: 'Pick a date range to run report'
                        });
                    } else {
                        let start_date = date_range[0], end_date = date_range[1];
                        if (user == "" || user == undefined || user == null) {
                            sql = 'session.activity LIKE ? AND session.dateTime BETWEEN ? AND ? ORDER BY session.dateTime ASC';
                            columns = ['%deactivate%', start_date, end_date]
                        } else {
                            sql = 'session.userID=? AND session.activity LIKE ? AND session.dateTime BETWEEN ? AND ?  ORDER BY session.dateTime ASC';
                            columns = [user, '%deactivate%', start_date, end_date,]
                        }
                        

                        let result = await PearsonSpectorRptApiModel.getSessionUserRecords(Database, {
                            sql: sql,
                            columns: columns
                        });

                        socket.emit(melody1 + '_' + param, {
                            data: result,
                            reportType: (user == "" || user == undefined || user == null) ? 'date' : 'user'
                        });
                    }
                } else {
                    socket.emit(melody1 + '_' + param, {
                        type: 'caution',
                        message: 'You have no privilege to run this report!'
                    });
                }
            } else if (param === "document_upload_report") {
                console.log(browserblob);
                if (privilegeData !== undefined && privilegeData.pearson_specter.document_upload_report == "yes") {
                    let user = browserblob.user;
                    let date_range = browserblob.date_range.split("**");

                    if (date_range.length < 1 || date_range.length == 0) {
                        socket.emit(melody1 + '_' + param, {
                            type: 'caution',
                            message: 'Pick a date range to run report'
                        });
                    } else {
                        let start_date = date_range[0], end_date = date_range[1];
                        if (user == "" || user == undefined || user == null) {
                            sql = 'document.dateTime BETWEEN ? AND ? ORDER BY document.dateTime ASC';
                            columns = [start_date, end_date]
                        } else {
                            sql = 'document.dateTime BETWEEN ? AND ? AND FIND_IN_SET(?, document.userIDs) ORDER BY document.dateTime ASC';
                            columns = [start_date, end_date, user];
                        }
                        

                        let result = await PearsonSpectorRptApiModel.getDocumentRecords(Database, {
                            sql: sql,
                            columns: columns
                        });
                        console.log(result);

                        socket.emit(melody1 + '_' + param, {
                            data: result,
                            reportType: (user == "" || user == undefined || user == null) ? 'date' : 'user'
                        });
                    }
                } else {
                    socket.emit(melody1 + '_' + param, {
                        type: 'caution',
                        message: 'You have no privilege to run this report!'
                    });
                }
            } else if (param === "document_state_report") {
                if (privilegeData !== undefined && privilegeData.pearson_specter.department_state_report == "yes") {
                    let date_range = browserblob.date_range.split("**");

                    if (date_range.length < 1 || date_range.length == 0) {
                        socket.emit(melody1 + '_' + param, {
                            type: 'caution',
                            message: 'Pick a date range to run report'
                        });
                    } else {
                        let start_date = date_range[0], end_date = date_range[1];
                        sql = 'dateTime BETWEEN ? AND ?  ORDER BY dateTime ASC';
                        columns = [start_date, end_date]
                        
                        let result = await PearsonSpectorRptApiModel.getDepartmentRecords(Database, {
                            sql: sql,
                            columns: columns
                        });

                        socket.emit(melody1 + '_' + param, {
                            data: result
                        });
                    }
                } else {
                    socket.emit(melody1 + '_' + param, {
                        type: 'caution',
                        message: 'You have no privilege to run this report!'
                    });
                }
            }
        } catch (error) {
            socket.emit(melody1 + '_' + param, {
                type: 'error',
                message: error
            });
        }
    });
}

