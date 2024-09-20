module.exports = function combinePrivileges(dataone, datatwo) {
    if (dataone.length < 1) {
        var privilegeOne = datatwo;
    } else {
        var privilegeOne = dataone;
    }

    if (datatwo.length < 1) {
        var privilegeTwo = dataone;
        // console.log('It is less');
    } else {
        var privilegeTwo = datatwo;
        // console.log('It is greater');
    }

    var keys = [];
    var obj = privilegeOne[0];
    //Get all keys in the array
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    
    //Use the keys to get the values and perform the logic
    for (let i = 0; i < keys.length; i++) {
        var field = keys[i];
        //Get first privilege data by userid
        var dataOnefieldvalue = privilegeOne[0][''+field+''];
        //Get second privilege data by roleid
        var dataTwofieldvalue = privilegeTwo[0][''+field+''];
        //Check if any of them contains yes or none of the contains yes
        if (dataOnefieldvalue == "yes" || dataTwofieldvalue == "yes") {
            //Set the value of the first privilege array to yes if any of the first or second array contains yes
            privilegeOne[0][''+field+''] = "yes";
        } else { 
            //Set the value of the second privilege array to no if any of both arrays contain no
            privilegeOne[0][''+field+''] = "no";
        }
    }
    //Return the altered array to be used
    return privilegeOne[0];
}