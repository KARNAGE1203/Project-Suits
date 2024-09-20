const Session = require('./SessionModel');
const CreateUpdateModel = require('./CreateUpdateModel');


class Document {

    //Constructor 
    constructor (Database) {
        //Create foreign key tables
        this.SessionModel = new Session(Database);

        this.Database = Database;

        //Table columns
        this.columnsList = ['documentID', 'userIDs', 'fileName', 'dateTime', 'status'];

        //Call to create table if not exist
        this.createTable();
    }

    //Insert method
    async insertTable (columns) {
        let result = await this.createTable();
        try {
            if (result) {
                let sql = `
                    INSERT IGNORE INTO document (${this.columnsList.toString()}) VALUES (?,?,?,?,?);
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
            let sql = 'UPDATE document SET '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

    // Append IDS Method
    async appendUserIDs(documentID, newUserIDs) {
        try {
            // Fetch existing userIDs
            let fetchSql = 'SELECT userIDs FROM document WHERE documentID = ?';
            let fetchResult = await this.Database.setupConnection({sql: fetchSql, columns: [documentID]}, 'object');

            if (fetchResult.length === 0) {
                throw new Error('Document not found');
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
            let updateSql = 'UPDATE document SET userIDs = ? WHERE documentID = ?';
            let updateResult = await this.Database.setupConnection({sql: updateSql, columns: [updatedUserIDs, documentID]}, 'object');

            return updateResult;
        } catch (error) {
            return error;
        }
    }

    //Fetch for prepared statement
    async preparedFetch (object) {
        try {
            let sql = 'SELECT * FROM document WHERE '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

     //Fetch for prepared statement left join user
    async preparedLeftJoinFetch (object) {
        try {
            let sql = `
                SELECT document.documentID AS documentID, 
                document.userIDs AS userIDs, 
                document.fileName AS fileName, 
                document.dateTime AS dateTime,
                document.status AS status,  
                user.firstName AS firstName,
                user.lastName AS lastName
                FROM document 
                LEFT JOIN user ON user.userID = document.userIDs  
                WHERE ${object.sql}
            `;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }
    
    //Create table method
    async createTable() {
        const CreateUpdateTable = new CreateUpdateModel(this.Database, {
            tableName: 'document',

            createTableStatement: (`
                documentID BIGINT(100) PRIMARY KEY,
                userIDs text,
                fileName varchar(255),
                dateTime text,
                status varchar(1)
            `),

            foreignKeyStatement: (``),

            alterTableStatement: ['userIDs-text']
        });
        let result = await CreateUpdateTable.checkTableExistence();
        return result;
    }


    //Fetch for prepared statement
    async countFetch (object) {
        try {
            let sql = 'SELECT COUNT(documentID) FROM document WHERE '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

}

module.exports = Document;