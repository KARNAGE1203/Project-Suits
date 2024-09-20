const CreateUpdateModel = require('./CreateUpdateModel');

//Intialize Class
class User {

    //Constructor 
    constructor (Database) {

        this.Database = Database;

        //Table columns
        this.columnsList = ['userID', 'firstName','lastName', 'email', 'phone', 'address', 'username', 'password', 'roleID', 'dateTime', 'status'];

        //Call to create table if not exist
        this.createTable();
    }

    //Insert method
    async insertTable (columns) {
        let result = await this.createTable();
        try {
            if (result) {
                let sql = `
                    INSERT IGNORE INTO user (${this.columnsList.toString()}) VALUES (?,?,?,?,?,?,?,?,?,?,?);
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
            let sql = 'UPDATE user SET '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

    //Fetch for prepared statement
    async preparedFetch (object) {
        try {
            let sql = 'SELECT * FROM user WHERE '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

    //Fetch for prepared statement
    async preparedLeftJoinFetch (object) {
        try {
            let sql = `
                SELECT user.userID AS userID, 
                user.firstName AS firstName, 
                user.lastName AS lastName, 
                user.email AS email, 
                user.phone AS phone, 
                user.address AS address, 
                user.username AS username, 
                user.password AS password, 
                user.roleID AS roleID, 
                user.dateTime AS dateTime, 
                user.status AS status,
                role.role AS role  
                FROM user 
                LEFT JOIN role ON user.roleID = role.roleID  
                WHERE ${object.sql}
            `;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

    async preparedFetchDepartment (object) {
        try {
            let sql = `
                SELECT u.*, r.role, d.department
                FROM department d
                JOIN user u ON FIND_IN_SET(u.userID, d.userIDs)
                LEFT JOIN role r ON u.roleID = r.roleID
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
            tableName: 'user',

            createTableStatement: (`
                userID BIGINT(100) PRIMARY KEY,
                firstName varchar(50),
                lastName varchar(50),
                email varchar(50),
                phone varchar(10), 
                address text,
                username varchar(255),
                password text,
                roleID BIGINT(100),
                dateTime text,
                status varchar(2)
            `),

            foreignKeyStatement: (`
                ALTER TABLE user 
                ADD FOREIGN KEY(roleID) REFERENCES role(roleID),
            `),

            alterTableStatement: [
                'dateTime text',
                'firstName varchar(50)',
                'lastName varchar(50)',
                'email varchar(50)',
                'phone varchar(10)',
                'address text'
            ],
        });
        let result = await CreateUpdateTable.checkTableExistence();
        return result;
    }

    //Fetch for prepared statement
    async countFetch (object) {
        try {
            let sql = 'SELECT COUNT(userID) FROM user WHERE '+object.sql;
            let result = await this.Database.setupConnection({sql: sql, columns: object.columns}, 'object');
            return result;
        } catch (error) {
            return error;
        }
    }

}

module.exports = User;