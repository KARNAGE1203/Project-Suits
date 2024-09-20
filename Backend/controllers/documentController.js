const Document = require('../Models/DocumentModel');
const Session = require('../Models/SessionModel');
const Privilege = require('../Models/PrivilegeFeaturesModel');
const GeneralFunction = require('../Models/GeneralFunctionModel');
const getSessionIDs = require('../controllers/getSessionIDs');
const gf = new GeneralFunction();
const md5 = require('md5');
const UploadFile = require('../Models/UploadFileModel');

module.exports = (socket, Database) => {
    socket.on('insertNewDocument', async (browserblob, cb) => {
        const { ps_manage_document_hiddenid, ps_document_upload_dropzone_rename, DocumentsForUpdate, melody1, melody2 } = browserblob;
        const session = getSessionIDs(melody1);
        const { userID } = session;
        console.log(browserblob);

        try {
            if (md5(userID) !== melody2) {
                return cb({ type: 'caution', message: 'Sorry your session has expired, wait for about 18 seconds and try again...', timeout: 'no' });
            }

            const DocumentModel = new Document(Database);
            const PrivilegeModel = new Privilege(Database, userID);
            const gf = new GeneralFunction();

            // Check for empty fields
            const emptyCheckResult = await gf.ifEmpty([ps_document_upload_dropzone_rename, DocumentsForUpdate]);
            if (emptyCheckResult.includes('empty')) {
                return cb({ type: 'caution', message: 'All fields are required!' });
            }

            const privilegeData = (await PrivilegeModel.getPrivileges()).privilegeData;
            const privilege = ps_manage_document_hiddenid ? privilegeData.pearson_specter.edit_document : privilegeData.pearson_specter.add_document;

            if (privilege !== "yes") {
                return cb({ type: 'caution', message: 'You have no privilege to perform this task' });
            }

            const documentID = ps_manage_document_hiddenid || 0;

            
            // Check if a document with the same name already exists
            const existingDocuments = await DocumentModel.preparedFetch({
                sql: 'fileName = ? AND documentID = ? AND status = ?',
                columns: [ps_document_upload_dropzone_rename, documentID, 'a']
            });

            if (Array.isArray(existingDocuments) && existingDocuments.length > 0) {
                return cb({ type: 'caution', message: 'Sorry, document with the same name exists' });
            }

            let documentNames;
            let UploadFileHandler
            if (documentID !== 0) {
                UploadFileHandler = new UploadFile(DocumentsForUpdate, ps_document_upload_dropzone_rename);
                documentNames = UploadFileHandler._getFileNames().toString();
            } else {
                UploadFileHandler = new UploadFile(DocumentsForUpdate, ps_document_upload_dropzone_rename);
                documentNames = UploadFileHandler._getFileNames().toString();
            }

            console.log(UploadFileHandler);
            let result;
            if (!ps_manage_document_hiddenid) {
                for (const document of documentNames.split(',')) {
                    // Check if each document name is unique before inserting
                    const existingDocument = await DocumentModel.preparedFetch({
                        sql: 'fileName = ? AND status = ?',
                        columns: [document, 'a']
                    });

                    if (existingDocument.length > 0) {
                        return cb({ type: 'caution', message: `Sorry, document with the name ${document} already exists` });
                    }

                    const newDocumentID = gf.getTimeStamp();
                    result = await DocumentModel.insertTable([newDocumentID, userID, document, gf.getDateTime(), 'a']);
                }
            } else {
                const sql = 'fileName = ? WHERE documentID = ? AND status = ?';
                const columns = [documentNames, documentID, 'a'];
                result = await DocumentModel.updateTable({ sql, columns });
            }

            if (result && result.affectedRows !== undefined) {
                if (Array.isArray(DocumentsForUpdate) && DocumentsForUpdate.length > 0) {
                    UploadFileHandler._uploadFiles();
                }

                const SessionModel = new Session(Database);
                const newSessionID = gf.getTimeStamp();
                const sessionResult = await SessionModel.insertTable([newSessionID, userID, gf.getDateTime(), ps_manage_document_hiddenid ? 'updated a document record' : 'added a new document']);

                const message = ps_manage_document_hiddenid ? 'Document has been updated successfully' : 'Document has been created successfully';
                if (sessionResult.affectedRows) {
                    return cb({ type: 'success', message });
                } else {
                    return cb({ type: 'error', message: 'Oops, something went wrong: Error => ' + sessionResult });
                }
            } else {
                return cb({ type: 'error', message: 'Oops, something went wrong: Error => ' + result });
            }
        } catch (error) {
            console.error('Error:', error);
            return cb({ type: 'error', message: 'An unexpected error occurred' });
        }
    });
};