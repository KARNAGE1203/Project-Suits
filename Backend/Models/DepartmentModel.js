const Session = require('./SessionModel');
const CreateUpdateModel = require('./CreateUpdateModel');


class Department {

    //Constructor 
    constructor (Database) {
        //Create foreign key tables
        this.SessionModel = new Session(Database);

        this.Database = Database;

        //Table columns
        this.columnsList = ['departmentID', 'userIDs', 'department', 'description', 'dateTime', 'status'];

        //Call to create table if not exist
        this.createTable();
    }

    //Insert method
    async insertTable (columns) {
        let result = await this.createTable();
        try {
            if (result) {
                let sql = `
                    INSERT IGNORE INTO department (${this.columnsList.toString()}) VALUES (?,?,?,?,?,?);
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
            let sql = 'UPDATE department SET '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

    //Fetch for prepared statement
    async preparedFetch (object) {
        try {
            let sql = 'SELECT * FROM department WHERE '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

    // Append userID method
    async appendUserIDs(departmentID, newUserIDs) {
        try {
            // Fetch existing userIDs
            let fetchSql = 'SELECT userIDs FROM department WHERE departmentID = ?';
            let fetchResult = await this.Database.setupConnection({sql: fetchSql, columns: [departmentID]}, 'object');

            if (fetchResult.length === 0) {
                throw new Error('Department not found');
            }

            let existingUserIDs = fetchResult[0].userIDs ? fetchResult[0].userIDs.split(',') : [];
            let newUserIDsArray = newUserIDs.split(',');

            // Filter out IDs that already exist
            let uniqueNewUserIDs = newUserIDsArray.filter(id => !existingUserIDs.includes(id));

            if (uniqueNewUserIDs.length === 0) {
                return { affectedRows: 0, message: 'No new user IDs to add' };
            }

            // Combine and update userIDs
            let updatedUserIDs = [...existingUserIDs, ...uniqueNewUserIDs].join(',');

            // Update the userIDs column
            let updateSql = 'UPDATE department SET userIDs = ? WHERE departmentID = ?';
            let updateResult = await this.Database.setupConnection({sql: updateSql, columns: [updatedUserIDs, departmentID]}, 'object');

            return updateResult;
        } catch (error) {
            return error;
        }
    }
    
    //Create table method
    async createTable() {
        const CreateUpdateTable = new CreateUpdateModel(this.Database, {
            tableName: 'department',

            createTableStatement: (`
                departmentID BIGINT(100) PRIMARY KEY,
                userIDs text,
                department varchar(255),
                description text,
                dateTime text,
                status varchar(1)
            `),

            foreignKeyStatement: (``),

            alterTableStatement: [
                'dateTime text, userIDs text'
            ],
        });
        let result = await CreateUpdateTable.checkTableExistence();
        return result;
    }


    //Fetch for prepared statement
    async countFetch (object) {
        try {
            let sql = 'SELECT COUNT(departmentID) FROM department WHERE '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

}

module.exports = Department;