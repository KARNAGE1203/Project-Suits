const getSessionIDs = require('../controllers/getSessionIDs');
const Session = require('../Models/SessionModel');
const GeneralFunction = require('../Models/GeneralFunctionModel');
const gf = new GeneralFunction();
const md5 = require('md5');

module.exports = function(socket, Database) {
    socket.on('logoutAction', async function(browserblob) {
        let melody1 = browserblob.melody1;

        let session = getSessionIDs(melody1);
        let userID = session.userID;
        
        const SessionModel = new Session(Database);

        if (md5(userID) == browserblob.melody2) {
            let sessionid = gf.getTimeStamp();
            result = await SessionModel.insertTable([sessionid, userID, gf.getDateTime(), 'logged out of system']);
            if (result.affectedRows) {
                socket.emit(melody1+'_logoutAction', {
                    'type': 'success',
                    'message': 'Logging out...'
                });
            } else {
                socket.emit(melody1+'_logoutAction', {
                    type: 'error',
                    message: 'Oops, something went wrong, try again later: '+result
                });
            }
        } else {
            socket.emit(melody1+'_logoutAction', {
                'type': 'caution',
                'message': 'Sorry your session has expired, you are being logged out...',
                'timeout': 'yes'
            });
        }
    });
}