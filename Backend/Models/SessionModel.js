const CreateUpdateModel = require('./CreateUpdateModel');

//Intialize Class
class Session {

    //Constructor 
    constructor (Database) {
        this.Database = Database;

        //Table columns
        this.columnsList = ['sessionID', 'userID', 'DateTime', 'activity'];

        //Call to create table if not exist
        this.createTable();
    }

    //Insert method
    async insertTable (columns) {
        let result = await this.createTable();
        try {
            if (result) {
                let sql = `
                    INSERT IGNORE INTO session (${this.columnsList.toString()}) VALUES (?,?,?,?);
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
            let sql = 'UPDATE session SET '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

    //Fetch for prepared statement
    async preparedFetch (object) {
        try {
            let sql = 'SELECT * FROM session WHERE '+object.sql;
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
                SELECT session.sessionID AS sessionID, 
                session.userID AS userID, 
                session.dateTime AS dateTime, 
                session.activity AS activity, 
                user.firstName AS firstName,
                user.lastName AS lastName
                FROM session 
                LEFT JOIN user ON session.userID = user.userID  
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
            tableName: 'session',

            createTableStatement: (`
                sessionID BIGINT(100) PRIMARY KEY,
                userID BIGINT(100),
                DateTime text,
                activity varchar(255)
            `),

            foreignKeyStatement: (`
                ALTER TABLE session 
                ADD FOREIGN KEY(userID) REFERENCES user(userID); 
            `),

            alterTableStatement: []
        });
        let result = await CreateUpdateTable.checkTableExistence();
        return result;
    }

}

module.exports = Session;