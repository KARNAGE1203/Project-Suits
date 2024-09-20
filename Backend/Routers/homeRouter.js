
const User = require('../Models/UserModel');
const Session = require('../Models/SessionModel');
const Role = require('../Models/RoleModel');
const Apps = require('../Models/AppsModel');
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({path: path.join(__dirname, `../../system.env`)})


module.exports = function (start, Database) {

    start.get('/', async function (request, response) {
        
        queryStr = request.query;
        const confiq = process.env

        if (confiq && confiq.DB_NAME && confiq.DB_NAME != '' || confiq.DB_NAME != undefined) {
            
            new User(Database);
            new Session(Database);
            new Role(Database);
            new Apps(Database);

            const AppsModel = new Apps(Database);
            let appsResult = await AppsModel.preparedFetch({
                sql: 'appsID = ? AND app = ?',
                columns: ['1', 'pearson_specter']
            });

            if (Array.isArray(appsResult) && appsResult.length > 0) {
                console.log('No Apps Result');
                response.render('index', { pageNavigate: queryStr });
            } else {
                const UserModel = new User(Database);
                const AppsModel = new Apps(Database);

                let result = await AppsModel.insertTable(['1', 'pearson_specter','yes']);

                if (Array.isArray(result)) {
                    response.render('index', { pageNavigate: queryStr });
                } else {
                    console.log('Invalid user ID 1');
                    response.render('index', {pageNavigate: {error: 'loginError2'}});
                }
            }
        } else {
            console.log('First error run');
        }
    });
}


String.prototype.shuffle = function () {
    var a = this.split(""), n = a.length;
    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}