const Session = require('./SessionModel');
const CreateUpdateModel = require('./CreateUpdateModel');


class Role {

    //Constructor 
    constructor (Database) {
        //Create foreign key tables
        this.SessionModel = new Session(Database);

        this.Database = Database;

        //Table columns
        this.columnsList = ['roleID', 'role', 'description', 'dateTime', 'status'];

        //Call to create table if not exist
        this.createTable();
    }

    //Insert method
    async insertTable (columns) {
        let result = await this.createTable();
        try {
            if (result) {
                let sql = `
                    INSERT INTO role (${this.columnsList.toString()}) VALUES (?,?,?,?,?);
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
        try {
            let sql = 'UPDATE role SET '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

    //Fetch for prepared statement
    async preparedFetch (object) {
        try {
            let sql = 'SELECT * FROM role WHERE '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }
    
    //Create table method
    async createTable() {
        const CreateUpdateTable = new CreateUpdateModel(this.Database, {
            tableName: 'role',

            createTableStatement: (`
                roleID BIGINT(100) PRIMARY KEY,
                role varchar(255),
                description text,
                dateTime text,
                status varchar(1)
            `),

            foreignKeyStatement: (``),

            alterTableStatement: [
                'dateTime text'
            ],
        });
        let result = await CreateUpdateTable.checkTableExistence();
        return result;
    }

}

module.exports = Role;