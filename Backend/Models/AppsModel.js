const CreateUpdateModel = require('./CreateUpdateModel');

//Intialize Class
class Apps {

    //Constructor 
    constructor (Database) {
        this.Database = Database;

        //Table columns
        this.columnsList = ['appsID', 'app', 'access'];

        //Call to create table if not exist
        this.createTable();
    }

    //Insert method
    async insertTable (columns) {
        let result = await this.createTable();
        try {
            if (result) {
                let sql = `
                    INSERT INTO apps (${this.columnsList.toString()}) VALUES (?,?,?);
                `;
                result = await this.Database.setupConnection({sql: sql, columns: columns}, 'object');
                return result;
            } else {
                return result;
            }
        } catch (error) {
            return error;
        }
    }

    //Update method
    async updateTable (object) {
        let result = await this.createTable();
        try {
            if (result) {
                let sql = 'UPDATE apps SET '+object.sql;
                result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
                return result;
            } else {
                return result;
            }
        } catch (error) {
            return error;
        }
    }

    //Fetch for prepared statement
    async preparedFetch (object) {
        let result = await this.createTable();
        try {
            if (result) {
                let sql = 'SELECT * FROM apps WHERE '+object.sql;
                result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
                return result;
            } else {
                return result;
            }
        } catch (error) {
            return error;
        }
    }

    async createTable() {
        const CreateUpdateTable = new CreateUpdateModel(this.Database, {
            tableName: 'apps',

            createTableStatement: (`
                appsID BIGINT(100) PRIMARY KEY,
                app varchar(255),
                access varchar(5)
            `),

            foreignKeyStatement: '',

            alterTableStatement: []
        });
        let result = await CreateUpdateTable.checkTableExistence();
        return result;
    }
}

module.exports = Apps ;