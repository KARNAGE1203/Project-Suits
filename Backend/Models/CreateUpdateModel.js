const ini = require('ini');
const fs = require('fs');
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, `./../../system.env`)})

class CreateUpdateModel {
    /**
     * Constructor of this class
     * @param {object} Database - A database connection object that will allows connection to the database.
     * @param {object} Statements - All statements for creating and altering tables.
     * @param {string} Statements.tableName - The name of the table or entity that should be checked if it exist.
     * @param {string} Statements.createTableStatement - SQL statement for creating a table.
     * @param {string} Statements.foreignKeyStatement - SQL statement for creating foreign keys.
     * @param {Object[]} Statements.alterTableStatement - An array containing columns with their data-type as in the example. EXAMPLE: ['name-varchar(5)', 'gender-varchar(5)'] into the columns array
     * It firstly check for the existence of the table, if it does not exist it creates a new table. If it does exist, then it alters the table
     */
    constructor(Database, Statements) {
        this.confiq = {
            DB_NAME: process.env.DB_NAME
        }
        this.Database = Database;
        this.tableName = Statements.tableName.trim();
        this.createTableStatement = Statements.createTableStatement;
        this.alterTableStatement = Statements.alterTableStatement;
        this.foreignKeyStatement = Statements.foreignKeyStatement;
        this.alterViewTableStatement = Statements.alterViewTableStatement;
        this.primaryKey = this.createTableStatement.split('BIGINT(100) PRIMARY KEY')[0];
    }

    async checkTableExistence () {
        if (this.checkIfValue(this.tableName)) {
            let result = await this.checkIfTableExist(this.tableName, 'BASE TABLE');
            // if (this.tableName == 'employee_bank') {
            //     console.log('check table existence result: ', result)
            // }
            if (result) {
                // await this.createTrigger();
                await this.alterTable();
                this.addForeignKeys()
                return true;
            } else {
                return await this.createTable();
            }
        } else {
            return false;
        }
    }

    async createTable () {
        try {
            if (this.checkIfValue(this.tableName) && this.checkIfValue(this.createTableStatement)) {
                let sql = `
                    CREATE TABLE IF NOT EXISTS ${this.tableName} (
                        ${this.createTableStatement}
                    );
                `;
                let result = await this.Database.setupConnection(sql, 'sql');
                if (result && result.affectedRows != undefined) {
                    this.addForeignKeys();
                    return true;
                } else {
                    console.log(this.tableName + ' Create Table:: => ', result);
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log(this.tableName + ' Create Table: => ', error);
            return false;
        }
    }

    async createView () {
        if (this.checkIfValue(this.tableName) && this.checkIfValue(this.createTableStatement)) {
            try {
                let result = await this.checkIfTableExist(this.tableName, 'VIEW');
                if (result) {
                    return this.alterViewTable();
                } else {
                    let sql = `
                        CREATE VIEW ${this.tableName} AS
                            ${this.createTableStatement}
                        ;
                    `;
                    let result = await this.Database.setupConnection(sql, 'sql');
                    if (result && result.affectedRows != undefined) {
                        console.log('Table is created successfully');
                        return true;
                    } else {
                        console.log('Could not create view');
                        return false;
                    }
                }
            } catch (error) {
                console.log(this.tableName + ' Create View: => ', error);
                return false;
            }
        } else {
            return false;
        }
    }

    async checkIfTableExist(tableName, tableType) {
        try {
            let result = await this.Database.setupConnection(
                `
                    SELECT * FROM information_schema.tables 
                    WHERE TABLE_SCHEMA = '${this.confiq.DB_NAME}' 
                    AND TABLE_NAME = '${tableName}' 
                    AND TABLE_TYPE = '${tableType}'
                `, 
            'sql');
            result = Array.isArray(result) && result.length > 0 ? true : false;
            return result
        } catch (error) {
            return false;
        }
    }

    async addForeignKeys () {
        try {
            if (this.checkIfValue(this.tableName) && this.checkIfValue(this.foreignKeyStatement)) {
                let getTotalForeignKeys = this.foreignKeyStatement == '' ? [] : this.foreignKeyStatement.split('ADD FOREIGN KEY');
                getTotalForeignKeys = getTotalForeignKeys.length - 1;
                let sql = `SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '${this.confiq.DB_NAME}' AND TABLE_NAME = '${this.tableName}' AND CONSTRAINT_NAME LIKE '%ibfk%'`;
                let result = await this.Database.setupConnection(sql, 'sql');
                if (Array.isArray(result) && result.length > Number(getTotalForeignKeys)) {
                    for (let i = 0; i < result.length; i++) {
                        const key = result[i];
                        sql = `ALTER TABLE ${this.tableName} DROP FOREIGN KEY ${key.CONSTRAINT_NAME};`;
                        let checker = await this.Database.setupConnection(sql, 'sql');
                        // if (this.tableName == 'employee_bank') {
                        //     console.log('key: ', sql, ' result: ', JSON.stringify(checker))
                        // }
                    }
                }

                sql = `
                    IF NOT EXISTS 
                        (SELECT NULL FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = '${this.confiq.DB_NAME}' AND TABLE_NAME = '${this.tableName}' AND CONSTRAINT_NAME LIKE '%ibfk%') 
                    THEN
                        ${this.foreignKeyStatement}
                    END IF
                `;
                result = await this.Database.setupConnection(sql, 'sql');
                // if (this.tableName == 'employee_bank') {
                //     console.log('foreign key result: ', result)
                // }
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(this.tableName + ' Foreign Key Altering: => ', error);
            return false;
        }
    }

    async alterTable () {
        try {
            if (this.tableName == 'employee_bank') {
                console.log('alter table start')
            }
            if (this.checkIfValue(this.tableName)) {
                let sql = `SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '${this.confiq.DB_NAME}' AND TABLE_NAME = '${this.tableName}' AND CONSTRAINT_NAME LIKE '%PRIMARY%'`;
                let result = await this.Database.setupConnection(sql, 'sql');
                // if (this.tableName == 'employee_bank') {
                //     console.log('primary key result: ', result)
                // }
                if (Array.isArray(result) && result.length <= 0) {
                    sql = `ALTER TABLE ${this.tableName} ADD PRIMARY KEY(${this.primaryKey});`;
                    let checker = await this.Database.setupConnection(sql, 'sql');
                    // if (this.tableName == 'employee_bank') {
                    //     console.log('primary key checker: ', checker, ' sql: ', sql)
                    // }
                }


                if (this.checkIfValue(this.alterTableStatement) && this.alterTableStatement.length > 0) {
                    for (let i = 0; i < this.alterTableStatement.length; i++) {
                        const item = this.alterTableStatement[i];
                        let split = item.split("-");
                        let column = split[0];
                        let datatype = split[1];
                        sql = `
                            SHOW COLUMNS from ${this.tableName} LIKE '${column}';
                        `;
                        result = await this.Database.setupConnection(sql, 'sql');
                        if (result.length < 1 || result.length == 0) {
                            sql = `
                                ALTER TABLE ${this.tableName}
                                ADD COLUMN ${column} ${datatype};
                            `;
                            result = await this.Database.setupConnection(sql, 'sql');
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(this.tableName + ' Alter Table: => ', error);
            return true;
        }
    }

    async alterViewTable () {
        if (this.checkIfValue(this.tableName) && this.checkIfValue(this.alterViewTableStatement)) {
            try {
                let alterChecker = [];
                if (this.alterViewTableStatement.length > 0) {
                    for (let i = 0; i < this.alterViewTableStatement.length; i++) {
                        const item = this.alterViewTableStatement[i];
                        let sql = `
                            SHOW COLUMNS from ${this.tableName} LIKE '${item}';
                        `;
                        let result = await this.Database.setupConnection(sql, 'sql');
                        result = Array.isArray(result) ? result : [];
                        if (result.length <= 0) {
                            alterChecker.push('true');
                        }
                    }
                }
                if (alterChecker.includes('true')) {
                    let sql = `
                        DROP VIEW ${this.tableName};
                    `;
                    let result = await this.Database.setupConnection(sql, 'sql');
                    if (result && result.affectedRows != undefined) {
                        return await this.createView();
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            } catch (error) {
                console.log(this.tableName + ' Alter View Table: => ', error);
                return false;
            }
        } else {
            return true;
        }
    }

    async createTrigger() {
        try {
            if (this.checkIfValue(this.tableName)) {
                let sql = `SELECT * FROM INFORMATION_SCHEMA.TRIGGERS WHERE TRIGGER_SCHEMA = '${this.confiq.DB_NAME}' AND EVENT_OBJECT_TABLE = '${this.tableName}'`;
                let result = await this.Database.setupConnection(sql, 'sql');
                if (Array.isArray(result) && result.length > 0) {
                    return true;
                } else {
                    sql = `
                        CREATE TRIGGER IF NOT EXISTS ${this.tableName}_insert_backup_trigger AFTER INSERT ON ${this.tableName}
                        FOR EACH ROW 
                        INSERT INTO db_backup(table_name, rowid, type, date_time)
                        VALUES('${this.tableName}', NEW.${this.primaryKey}, 'insert', NEW.date_time);
        
                        CREATE TRIGGER IF NOT EXISTS ${this.tableName}_update_backup_trigger AFTER UPDATE ON ${this.tableName}
                        FOR EACH ROW 
                        INSERT INTO db_backup(table_name, rowid, type, date_time)
                        VALUES('${this.tableName}', NEW.${this.primaryKey}, 'update', UTC_TIMESTAMP());
                    `;
                    result = await this.Database.setupConnection(sql, 'sql');
                    return true;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log(this.tableName + ' Creating triggers: => ', error);
            return false;
        }
    }

    /**
     * Method to check if param contains valid data
     * @param {object} value - A value to checked for validity
     */
    checkIfValue(value) {
        if (value == '' || value == ' ' || value == undefined || value == null || value == {} || value.length <= 0) {
            return false;
        } else {
            return true;
        }
    }
} //End of class

module.exports = CreateUpdateModel;