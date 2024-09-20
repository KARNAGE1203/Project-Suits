const PrivilegePearsonSpecter = {
    /** 
     * @const {string} tableTitle - Title of table which will be used at the frontend
    */
    tableTitle: 'Pearson Specter',
    
    /** 
     * @const {string} tableName - Key name of or privilege column name
    */
    tableName: 'privilege_pearson_specter',

    /** 
     * @const {string} allCheckBoxName - The value of allCheckBoxName is used to turn on and off of the "all" checkbox
    */
    allCheckBoxName: 'pearson_specter',

    /** 
     * @const {string} icon - Icon for the fieldset
    */
    icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',

    /** 
     * @const {Array} columnList - List of columns names for this table
    */
    columnList: [
        'add_privilege',
        'add_user', 'edit_user', 'deactivate_user', 
        'add_role', 'edit_role', 'deactivate_role',
        'add_department', 'edit_department', 'deactivate_department', 
        'add_document', 'edit_document', 'deactivate_document',
        'login_report', 'document_upload_report', 'deactivation_report','recent_activity_report', 'department_state_report',
        'assign_department','assign_user'
    ],

    /** 
     * @const {Array} createTableStatement - Create table sql statement as string
    */
    createTableStatement: (`
        privilegeID BIGINT(100) PRIMARY KEY,
        accountID BIGINT(100),
        add_privilege varchar(3),
        add_user varchar(3),
        edit_user varchar(3),
        deactivate_user varchar(3),
        add_role varchar(3),
        edit_role varchar(3),
        deactivate_role varchar(3),
        add_department varchar(3),
        edit_department varchar(3),
        deactivate_department varchar(3),
        add_document varchar(3),
        edit_document varchar(3),
        deactivate_document varchar(3),
        login_report varchar(3),
        document_upload_report varchar(3),
        deactivation_report varchar(3),
        recent_activity_report varchar(3),
        department_state_report varchar(3),
        assign_department varchar(3),
        assign_user varchar(3)
    `),

    /** 
     * @const {string} alterTableStatement - Alter table sql statement as an array. EXAMPLE: ['name-varchar(5)', 'gender-varchar(5)']
    */
    alterTableStatement: ['login_report-varchar(3)','document_upload_report-varchar(3)','deactivation_report-varchar(3)','recent_activity_report-varchar(3)','department_state_report-varchar(3)','recent_activity_report-varchar(3)','department_state_report-varchar(3)','assign_department-varchar(3)','assign_user-varchar(3)']
}

module.exports = PrivilegePearsonSpecter;