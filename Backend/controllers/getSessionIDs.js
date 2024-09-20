
module.exports = function getMelodyIds(melody1) {
    if (melody1 && melody1 !== "") {
        let userIDTxt = (melody1.split('-')[0]) ? melody1.split('-')[0] : 'none1230';
        let sessionIDTxt = (melody1.split('-')[1]) ? melody1.split('-')[1] : 'none10234';
        let userID = (userIDTxt.match(/\d/g).join("")) ? userIDTxt.match(/\d/g).join("") : 0;
        let sessionID = (sessionIDTxt.match(/\d/g).join("")) ? sessionIDTxt.match(/\d/g).join("") : 0;

        return {userID: parseInt(userID), sessionID: parseInt(sessionID)};
    } else {
        return {userID: 0, sessionID: 0};
    }
}