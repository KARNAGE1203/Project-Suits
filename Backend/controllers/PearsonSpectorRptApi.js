const Session = require('../Models/SessionModel');
const Document = require('../Models/DocumentModel');
const Department = require('../Models/DepartmentModel');


class PearsonSpectorRptApi {

    constructor() { }

    async getSessionRecords (Database, object) {
        try {
            const SessionModel = new Session(Database);
            
            let result = await SessionModel.preparedFetch({
                sql: object.sql,
                columns: object.columns
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getSessionUserRecords (Database, object) {
        try {
            const SessionModel = new Session(Database);
            
            let result = await SessionModel.preparedLeftJoinFetch({
                sql: object.sql,
                columns: object.columns
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getDocumentRecords (Database, object) {
        try {
            const DocumentModel = new Document(Database);
            
            let result = await DocumentModel.preparedLeftJoinFetch({
                sql: object.sql,
                columns: object.columns
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getDepartmentRecords (Database, object) {
        try {
            const DepartmentModel = new Department(Database);
            
            let result = await DepartmentModel.preparedFetch({
                sql: object.sql,
                columns: object.columns
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = PearsonSpectorRptApi;