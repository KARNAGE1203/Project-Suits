
const GeneralFunction = require('../Models/GeneralFunctionModel');
const User = require('../Models/UserModel');
const Department = require('../Models/DepartmentModel');
const Document = require('../Models/DocumentModel');
const getSessionIDs = require('../controllers/getSessionIDs');
const gf = new GeneralFunction();


module.exports = (socket, Database) => {
    socket.on('dashboardFetches', async (browserblob) => {
        let param = browserblob.param;
        let melody1 = browserblob.melody1;

        let session = getSessionIDs(melody1);
        let userid = session.userid;
        let sessionid = session.sessionid;
        
        const DocumentModel = new Document(Database);
        const UserModel = new User(Database);
        const DepartmentModel = new Department(Database);

        try {
            if (param === "") {
                socket.emit(melody1 + '_' + param, {
                    type: 'error',
                    message: 'Oops, something went wrong'
                });
            } else if (param === "dashboard_data") {
        
                let userData = await UserModel.countFetch({
                    sql: 'status != ?',
                    columns: ['inactive']
                });
                totalUsers = Array.isArray(userData) && userData.length > 0 ? userData[0]['COUNT(userID)'] : 0;


                let documentData = await DocumentModel.countFetch({
                    sql: 'status = ?',
                    columns: ['a']
                });
                totalDocuments = Array.isArray(documentData) && documentData.length > 0 ? documentData[0]['COUNT(documentID)'] : 0;

                let departmentData = await DepartmentModel.countFetch({
                    sql: 'status = ?',
                    columns: ['a']
                });
                totalDepartments = Array.isArray(departmentData) && departmentData.length > 0 ? departmentData[0]['COUNT(departmentID)'] : 0;

                socket.emit(melody1 + '_' + param, {
                    totalUsers: totalUsers,
                    totalDocuments: '0',
                    totalDepartments: totalDepartments
                });
            }

        } catch (error) {
            console.log(error);
            socket.emit(melody1 + '_' + param, {
                type: 'error',
                message: 'Oops! An error occurred: ' + error
            });
        }
    });
}
