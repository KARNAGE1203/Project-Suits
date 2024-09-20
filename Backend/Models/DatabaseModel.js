const mysql = require('mysql');
const sqlite = '';
const { promisify } = require('util');
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, `./../../system.env`)})

//Defining a class for the database connection
class DbConnect {

    //Constructor - this runs as soon the class is initiated
    constructor () {
        this.dbcon = '';
    }

    createConnection () {
        const thisClass = this;
        try {
            if (process.env.DB_CONNECTION_TYPE == 'mysql') {
                this.dbcon = mysql.createConnection({
                    host     : process.env.DB_HOST,
                    port     : process.env.DB_PORT,
                    user     : process.env.DB_USR,
                    password : (process.env.DB_PWD && process.env.DB_PWD != '') ? process.env.DB_PWD : '',
                    database : process.env.DB_NAME
                });
    
                if (this.dbcon) {
                    this.dbcon.connect(function(error) {
                        if (error) {
                            console.log('MySql Database is not connected. An error occurred');
                            console.log(error, "error");
                            setTimeout(() => {
                                thisClass.createConnection();
                            }, 30000);
                        } else {
                            console.log('MYSQL Database is connected successfully');
                        }
                    });
                } else {
                    console.log('MySql Database is not connected');
                    setTimeout(() => {
                        thisClass.createConnection();
                    }, 30000);
                }
            } else if (process.env.DB_CONNECTION_TYPE == 'sqlite') {
                this.dbcon = new sqlite.Database('./'+process.env.DB_NAME+'.db', (error) => {
                    if (error) {
                        console.log('SQLITE database connection error: ', error.message);
                        setTimeout(() => {
                            thisClass.createConnection();
                        }, 30000);
                    } else {
                        console.log('SQLITE Database is connected successfully');
                    }
                });
            }
        } catch (error) {
            // console.log(error);
            setTimeout(() => {
                thisClass.createConnection();
            }, 30000);
        }
    }

    //connection setup
    async setupConnection (sqlOrObject, type) {
        try {
            let sqlFormat;
            if (type == 'sql') {
                sqlFormat = sqlOrObject;
            } else {
                let sql = sqlOrObject.sql, 
                columns = sqlOrObject.columns;
                sqlFormat = mysql.format(sql, columns);
            }
    
            let promisifyConnection;
            if (process.env.DB_CONNECTION_TYPE == 'mysql') {
                promisifyConnection = promisify(this.dbcon.query).bind(this.dbcon);
            } else if (process.env.DB_CONNECTION_TYPE == 'sqlite') {
                promisifyConnection = promisify(this.dbcon.run).bind(this.dbcon);
            } else if (process.env.DB_CONNECTION_TYPE == 'sqlite-fetch') {
                promisifyConnection = promisify(this.dbcon.all).bind(this.dbcon);
            } else {
                promisifyConnection = promisify(this.dbcon.query).bind(this.dbcon);
            }
    
            return await promisifyConnection(sqlFormat);
        } catch (error) {
            // console.log(error);
        }
    }
}

module.exports = DbConnect;
