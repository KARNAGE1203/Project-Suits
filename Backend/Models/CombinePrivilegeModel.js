/**
 * A function to combine two privilege data as one
 * @param {object} dataone - An object of privilege data (Key value pair)
 * @param {object} datatwo - An object of privilege data (Key value pair)
 */
module.exports = function combinePrivileges(dataone, datatwo) {
    let privilegeOne, privilegeTwo;
    if (dataone.length < 1) {
        privilegeOne = datatwo;
    } else {
        privilegeOne = dataone;
    }

    if (datatwo.length < 1) {
        privilegeTwo = dataone;
        // console.log('It is less');
    } else {
        privilegeTwo = datatwo;
        // console.log('It is greater');
    }

    let keys = [];
    let obj = privilegeOne;
    //Get all keys in the array
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    
    //Use the keys to get the values and perform the logic
    for (let i = 0; i < keys.length; i++) {
        let field = keys[i];
        //Get first privilege data by userid
        let dataOnefieldvalue = privilegeOne[field];
        //Get second privilege data by roleid
        let dataTwofieldvalue = privilegeTwo[field];
        //Check if any of them contains yes or none of the contains yes
        if (dataOnefieldvalue == "yes" || dataTwofieldvalue == "yes") {
            //Set the value of the first privilege array to yes if any of the first or second array contains yes
            privilegeOne[field] = "yes";
        } else { 
            //Set the value of the second privilege array to no if any of both arrays contain no
            privilegeOne[field] = "no";
        }
    }
    //Return the altered array to be used
    return privilegeOne;
}