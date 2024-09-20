const CreateUpdateModel = require('./CreateUpdateModel');
const Apps = require('./AppsModel');
const CombinePrivilege = require('./CombinePrivilegeModel');
const GeneralFunction = require('./GeneralFunctionModel');
const gf = new GeneralFunction();

const PrivilegePearsonSpector = require('./PrivilegeModel');


class PrivilegeFeature {
    /**
     * Constructor of this class
     * @param {object} Database - A database connection object that will allows connection to the database.
     * @param {number} accountID - An account id in which queries will be performed on.
     */
    constructor(Database, accountID) {
        this.Database = Database;

        this.accountID = accountID;

        this.apps = [];

        this.appFeatures = '';

        this.getSupportedAppFeatures();
    }

    /**
     * A method that fetches for categorized app supported by business for frontend display.
     */
    async getFrontendPrivileges() {
        let appList = {};
        let apps = await this.fetchApps();
        if (apps.length > 0) {
            for (let i = 0; i < apps.length; i++) {
                const app = apps[i];
                if (app.app == 'pearson_specter') {
                    appList['pearson_specter'] = {
                        tableTitle: PrivilegePearsonSpector.tableTitle,
                        tableName: PrivilegePearsonSpector.tableName,
                        funcName: PrivilegePearsonSpector.funcName,
                        allCheckBox: PrivilegePearsonSpector.allCheckBoxName,
                        icon: PrivilegePearsonSpector.icon,
                        columnList: PrivilegePearsonSpector.columnList
                    };
                } 
            }
        }

        return appList;
    }

    /**
     * A method to run an update query for a single column
     * @param {string} table - Privilege table of which this query should be executed on.
     * @param {string} column - The column of which the it value should be updated.
     * @param {string} columnsValue - The value of the first column.
     * @param {string} category - The column of which the it value should be updated.
     * @param {string} categoryValue - The value of the first column.
     * @param {number} accountID - An account id in which queries will be performed on.
     */
    async updateSingleTable(table, column, columnsValue, category, categoryValue, accountID) {
        let result = await this.checkSinglePrivilegeExistence(table, accountID);
        let queryresult = '';
        if (result.length > 0) {
            queryresult = await this.Database.setupConnection({
                sql: 'UPDATE '+table+' SET '+column+' = ? WHERE accountID = ?',
                columns: [columnsValue, accountID]
            }, 'object');
        } else {
            let privilegeID = gf.getTimeStamp();
            queryresult = await this.Database.setupConnection({
                sql: 'INSERT INTO '+table+' (privilegeID, accountID, '+column+') VALUES(?, ?, ?)',
                columns: [privilegeID, accountID, columnsValue]
            }, 'object');
        }
        if (queryresult.affectedRows) {
            return {affectedRows: queryresult.affectedRows};
        } else {
            return {error: queryresult};
        }
    }

    /**
     * A method to run an update query for a all columns
     * @param {string} table - Privilege table of which this query should be executed on.
     * @param {string} dataValue - The constant value which are: yes||no to update the looped columns.
     * @param {number} accountID - An account id in which queries will be performed on.
     */
    async updateAllTableColumns(table, dataValue, accountID) {
        let privilegeArray = [], sql;
        if (table == 'privilege_pearson_specter') {
            privilegeArray = PrivilegePearsonSpector.columnList;
        }

        for (let i = 0; i < privilegeArray.length; i++) {
            let result = await this.checkSinglePrivilegeExistence(table, accountID);
            let queryresult = '';
            if (result.length > 0) {
                queryresult = await this.Database.setupConnection({
                    sql: 'UPDATE '+table+' SET '+privilegeArray[i]+' = ? WHERE accountID = ?',
                    columns: [dataValue, accountID]
                }, 'object');
            } else {
                let privilegeID = gf.getTimeStamp();
                queryresult = await this.Database.setupConnection({
                    sql: 'INSERT INTO '+table+' (privilegeID, accountID, '+privilegeArray[i]+') VALUES(?, ?, ?)',
                    columns: [privilegeID, accountID, dataValue]
                }, 'object');
            }
            queryresult.affectedRows != undefined ? '' : console.log(queryresult);
        }
        return {
            affectedRows: 1
        }
    }

    /**
     * A method to run an update query for a all columns
     * @param {string} table - Privilege table of which this query should be executed on.
     * @param {array} columns - Columns array contains all columns for a particular app in the privileges. 
     * @param {string} dataValue - The constant value which are: yes||no to update the looped columns.
     * @param {number} accountID - An account id in which queries will be performed on.
     */
    async updateAllExternalTableColumns(table, columns, dataValue, accountID) {
        let sql;
        for (let i = 0; i < columns.length; i++) {
            let result = await this.checkSinglePrivilegeExistence(table, accountID);
            let queryresult = '';
            if (result.length > 0) {
                queryresult = await this.Database.setupConnection({
                    sql: 'UPDATE '+table+' SET '+columns[i]+' = ? WHERE accountID = ?',
                    columns: [dataValue, accountID]
                }, 'object');
            } else {
                let privilegeID = gf.getTimeStamp();
                queryresult = await this.Database.setupConnection({
                    sql: 'INSERT INTO '+table+' (privilegeID, accountID, '+columns[i]+') VALUES(?, ?, ?)',
                    columns: [privilegeID, accountID, dataValue]
                }, 'object');
            }
            queryresult.affectedRows != undefined ? '' : console.log(queryresult);
        }
        return {
            affectedRows: 1
        }
    }

    /**
     * A method to run an insert query for a all related tables and columns
     * @param {number} privilegeID - A pre generated privilege ID.
     * @param {number} accountID - An account id in which queries will be performed on.
     */
    async insertTable (privilegeID, accountID, checker) {
        let apps = await this.fetchApps();
        try {
            let affectedRows = 0;
            if (apps.length > 0) {
                for (let i = 0; i < apps.length; i++) {
                    const app = apps[i];
                    let sql, columns;
                    if (app.app == 'pearson_specter') {
                        sql = 'INSERT INTO privilege_pearson_specter (privilegeID, accountID, add_privilege) VALUES(?, ?, ?)';
                        columns = [privilegeID, accountID];
                    }
                    if (sql !== undefined && columns !== undefined) {
                        let result = await this.Database.setupConnection({
                            sql: sql,
                            columns: columns
                        }, 'object');
                        if (result && result.affectedRows) {
                            affectedRows++;
                        }
                    }
                }
                return {
                    affectedRows: affectedRows
                };
            } else {
                return {
                    affectedRows: affectedRows
                };
            }
        } catch (error) {
            console.log('Inserting into privilege error: ', error)
            return error;
        }
    }

    /**
     * A method to check if userid exist in database
     * @param {string} table - Table name in which query should be run on
     * @param {number} accountID - Userid for the checking
     */
    async checkSinglePrivilegeExistence(table, accountID) {
        let result = await this.Database.setupConnection({
            sql: 'SELECT * FROM '+table+' WHERE accountID = ?',
            columns: [accountID]
        }, 'object');
        return (Array.isArray(result) && result.length > 0) ? result : [];
    }

    async getPrivileges() {
        const apps = await this.fetchApps();
        let privilegeData = {};
        let privilegeColumns = {};
        if (apps.length > 0) {
            for (let i = 0; i < apps.length; i++) {
                const app = apps[i];
                if (app.app == 'pearson_specter') {
                    privilegeData['pearson_specter'] = {};
                    let result = await this.fetchPrivilege('privilege_pearson_specter');
                    let columnsList = PrivilegePearsonSpector.columnList;
                    if (columnsList.length > 0) {
                        for (let i = 0; i < columnsList.length; i++) {
                            const column = columnsList[i];
                            privilegeData.pearson_specter[column] = result[column];
                            privilegeColumns[column] = result[column];
                        }
                    }
                } 
            }
        }

        return {
            privilegeData: privilegeData,
            privilegeColumns: privilegeColumns
        };
    }

    async fetchPrivilege(app) {
        try {
            let dataOne;
            let result = await this.checkSinglePrivilegeExistence(app, this.accountID);
            if (result.length > 0) {
                dataOne = await this.Database.setupConnection({
                    sql: 'SELECT * FROM '+app+' WHERE accountID = ?',
                    columns: [this.accountID]
                }, 'object');
                dataOne = Array.isArray(dataOne) && dataOne.length > 0 ? dataOne[0] : {};
            } else {
                let privilegeID = gf.getTimeStamp();
                let queryresult = await this.Database.setupConnection({
                    sql: 'INSERT INTO '+app+' (privilegeID, accountID) VALUES(?, ?)',
                    columns: [privilegeID, this.accountID]
                }, 'object');
                if (queryresult && queryresult.affectedRows != undefined) {
                    dataOne = await this.Database.setupConnection({
                        sql: 'SELECT * FROM '+app+' WHERE accountID = ?',
                        columns: [this.accountID]
                    }, 'object');
                    dataOne = Array.isArray(dataOne) && dataOne.length > 0 ? dataOne[0] : {};
                } else {
                    dataOne = {};
                }
            }

            let dataTwo = await this.Database.setupConnection({
                sql: 'SELECT * FROM '+app+' WHERE accountID IN (SELECT groupid FROM user_group WHERE accountID=? AND status=?)',
                columns: [this.accountID, 'active']
            }, 'object');
            dataTwo = Array.isArray(dataTwo) && dataTwo.length > 0 ? dataTwo[0] : {};

            let privilegeData = CombinePrivilege(dataOne, dataTwo);
            
            return privilegeData;
        } catch (error) {
            console.log(error);
            return {};
        }
    }

    /**
     * A function to check the existense of tables (Privilege tables).
     */
    async getSupportedAppFeatures() {
        const AppsModel = new Apps(this.Database);

        try {
            let result = await AppsModel.preparedFetch({
                sql: 'access = ?', 
                columns: ['yes']
            });
            result = Array.isArray(result) ? result : [];
            await this.checkToCreateTables(result);
            return false;
        } catch (error) {
            console.log('Privilege Feature Model Error => ', error);
        }
    }

    async checkToCreateTables(appFeatures) {
        let apps = []
        if (Array.isArray(appFeatures) && appFeatures.length > 0) {
            for (let i = 0; i < appFeatures.length; i++) {
                const app = appFeatures[i];
                if (apps.includes(app.app)) {} else {
                    apps.push(app.app);
                }
            }
        }
        await this.loopToCreateTables(apps);
        return false;
    }

    async loopToCreateTables(apps) {
        if (apps.length > 0) {
            for (let i = 0; i < apps.length; i++) {
                const app = apps[i];
                let statement;
                
                if (app == 'pearson_specter') {
                    statement = {
                        tableName: PrivilegePearsonSpector.tableName,
                        createTableStatement: PrivilegePearsonSpector.createTableStatement,
                        foreignKeyStatement: '',
                        alterTableStatement: PrivilegePearsonSpector.alterTableStatement
                    }
                } 

                const CreateUpdateTable = new CreateUpdateModel(this.Database, statement);
                await CreateUpdateTable.checkTableExistence();
            }
        }
    }

    /**
     * A function to fetch for apps.
     */
    async fetchApps() {
        const AppsModel = new Apps(this.Database);
        try {
            let result = await AppsModel.preparedFetch({
                sql: 'access = ?', 
                columns: ['yes']
            });
            result = Array.isArray(result) ? result : [];
            return result;
        } catch (error) {
            console.log('Privilege Feature Model Error2 => ', error);
        }
    }
    
} //End of class

module.exports = PrivilegeFeature;