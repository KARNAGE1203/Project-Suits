
$(document).ready(function () {

    // Global Variable & Functions here
    let holdUser;
    UserTableFetch();
    
    // Form Submit for user form
    $(document).on('submit', 'form.ps_manage_user_form', function (e) {
        e.preventDefault();

        //Get form data from html
        let ps_manage_user_hiddenid = $('.ps_manage_user_hiddenid', this).val();
        let ps_user_firstName = $('.ps_user_firstName', this).val(); 
        let ps_user_lastName = $('.ps_user_lastName', this).val();
        let ps_user_email = $('.ps_user_email', this).val();
        let ps_user_phone = $('.ps_user_phone', this).val();
        let ps_user_address = $('.ps_user_address', this).val();
        let ps_user_username = $('.ps_user_username', this).val();
        let ps_user_password = $('.ps_user_password', this).val();
        let ps_user_confirm_password = $('.ps_user_confirm_password', this).val();
        let ps_user_role_dropdown = $('.ps_user_role_dropdown', this).val();
        

        //Setting submit button to loader
        $('.ps_manage_user_submit_btn').html('<div class="mr-2 spinner-border align-self-center loader-sm"></div>');
        //Diable submit button
        $('.ps_manage_user_submit_btn').attr('disabled', 'disabled');
        
        socket.off('insertNewUser');
        socket.off(melody.melody1+'_insertNewUser'); 

        setTimeout(function () {
            socket.emit('insertNewUser', {
                "melody1": melody.melody1,
                "melody2": melody.melody2,
                "ps_manage_user_hiddenid": ps_manage_user_hiddenid,
                "ps_user_firstName": ps_user_firstName,
                "ps_user_lastName": ps_user_lastName,
                "ps_user_email": ps_user_email,
                "ps_user_phone": ps_user_phone,
                "ps_user_role_dropdown" : ps_user_role_dropdown,
                "ps_user_address": ps_user_address,
                "ps_user_username": ps_user_username,
                "ps_user_password": ps_user_password,
                "ps_user_confirm_password": ps_user_confirm_password
            });
        }, 500);

        //Get response from submit
        socket.on(melody.melody1 + '_insertNewUser', function (data) {
            //Get json content from login code
            if (data.type == "success") {
                //trigger alert using the alert function down there
                Toast.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    padding: '1em'
                })

                //Empty the form 
                $('.ps_manage_user_form').trigger('reset');
                socket.off(melody.melody1+'_insertNewUser'); 
                UserTableFetch();
            } else if (data.type == "caution") {
                Toast.fire({
                    text: data.message,
                    type: 'warning',
                    padding: '1em'
                })
            } else {
                //trigger alert using the alert function down there
                Toast.fire({
                    title: 'Error',
                    text: data.message,
                    type: 'error',
                    padding: '1em'
                })
            }
            //Set submit button back to its original text
            $('.ps_manage_user_submit_btn').html('Submit');
            //Enable submit button
            $('.ps_manage_user_submit_btn').removeAttr('disabled');
        });

    });

    // Form submit for assign department
    $(document).on('submit', 'form.ps_user_assign_department_form', function (e) {

        e.preventDefault();
        let ps_user_assign_department_hiddenid = $('.ps_user_assign_department_hiddenid', this).val();
        let ps_user_assign_department_dropdown = $('.ps_user_assign_department_dropdown', this).val();

        //Setting submit button to loader
        $('.ps_user_assign_department_submit_btn').html('<div class="mr-2 spinner-border align-self-center loader-sm"></div>');
        //Diable submit button
        $('.ps_user_assign_department_submit_btn').attr('disabled', 'disabled');

        socket.off('specific'); 
        socket.off(melody.melody1+'_specific'); 

        socket.emit('specific', {
            "melody1": melody.melody1,
            "melody2": melody.melody2,
            "melody3": melody.melody3,
            "param": 'assign_department',
            "hiddenID": ps_user_assign_department_hiddenid,
            "departmentID": ps_user_assign_department_dropdown
        });

        socket.on(melody.melody1 + '_assign_department', function (data) {   
            if (data.type == "success") {
                //trigger alert using the alert function down there
                Toast.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    padding: '1em'
                })

                //Empty the form 
                $('.ps_user_assign_department_form').trigger('reset');
                socket.off(melody.melody1+'_assign_department'); 
                UserTableFetch();
            } else if (data.type == "caution") {
                Toast.fire({
                    title: 'Caution',
                    text: data.message,
                    icon: 'warning',
                    padding: '1em'
                })
            } else {
                //trigger alert using the alert function down there
                Toast.fire({
                    title: 'Error',
                    text: data.message,
                    type: 'error',
                    icon: 'error',
                    padding: '1em'
                })
            }
            //Set submit button back to its original text
            $('.ps_user_assign_department_submit_btn').html('Submit');
            //Enable submit button
            $('.ps_user_assign_department_submit_btn').removeAttr('disabled');
        }
        );

    }
    );

    //User Table Fetch
    function UserTableFetch(){
        socket.off('table');
        socket.off(melody.melody1+'_user_table'); 

        socket.emit('table', {
            melody1: melody.melody1,
            melody2: melody.melody2,
            param: 'user_table'
        });

        // User Table Emit Response
        socket.on(melody.melody1 + '_user_table', (data) => {
            if (data.type == 'error') {
                console.log(data.message);
            } else {
                userDataTable(data);
            }
        });
    }

    //Data table creation function
    function userDataTable(dataJSONArray) {
        reCreateMdataTable('ps_user_data_table', 'ps_user_data_table_div');
        const datatable = $('.ps_user_data_table').mDatatable({
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10
            },
            search: {
                input: $('#ps_user_general_search'),
            },
            columns: [
                {
                    field: 'username',
                    title: "User",
                    type: 'text',
                    template: function (row) {
                        return (row.username);
                    }
                },
                {
                    field: 'role',
                    title: "Role",
                    type: 'text',
                    template: function (row) {
                        return (row.role);
                    }
                },
                {
                    field: 'status',
                    title: "Status",
                    type: 'text',
                    template: function (row) {
                        if (row.status == 'a') {
                            return `<span class="badge badge-success"> Active </span>`;
                        } else if (row.status == 'd') {
                            return `<span class="badge badge-danger"> Deactivated </span>`;
                        } else if (row.status == 'ad') {
                            return `<span class="badge badge-info"> Sys Admin </span>`;
                        } else {
                            return `<span class="badge badge-danger"> ${row.status.toUpperCase()} </span>`;
                        }
                    }
                },
                {
                    field: 'action',
                    title: 'Action',
                    template: function (row) {
                        let activateOrDeactivate, validate_delete;
                        const maindata = JSON.stringify(row).replace(/'/g, ":::");
        
                        if (row.status == "d") {
                            activateOrDeactivate = `<a href="#" class="dropdown-item ps_user_table_edit_btn" data-getid="${row.userID}" data-getname="deactivate_user" data-getdata="${row.username.toUcwords()}" data-activate="activate"><i class="icon-checkmark3 mr-2"></i> Reactivate</a>`;
                        } else {
                            activateOrDeactivate = `<a href="#" class="dropdown-item ps_user_table_edit_btn" data-getid="${row.userID}" data-getname="deactivate_user" data-getdata="${row.username.toUcwords()}" data-activate="deactivate"><i class="icon-blocked mr-2"></i> Deactivate</a>`;
                        }
                
                        if ($('.hidden_delete_for_admin').val() == 'admin') {
                            validate_delete = `<a href="#" class="dropdown-item ps_user_table_edit_btn" data-getid="${row.userID}" data-getname="delete_user" data-getdata="${row.user.toUcwords()}"><i class="icon-close2 mr-2"></i> Delete</a>`;
                        } else {
                            validate_delete = '';
                        }
                
                        return `
                            <div class="dropdown" > 
                                <a href="#" class="  m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">
                                    <i class="icon-menu7" style="font-size:20px"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="ps_user_table_edit_btn dropdown-item" href="#" data-getid="`+ row.userID + `" data-maindata='${maindata}' data-getname="specific_department"><i class="icon-add mr-2"></i></i>Assign Department</a> 
                                    <a class="ps_user_table_edit_btn dropdown-item" href="#" data-getid="`+ row.userID + `" data-getname="specific_user"><i class="icon-pencil mr-2"></i></i>Edit Details</a> 
                                    ${activateOrDeactivate}
                                    ${validate_delete}
                                </div>
                            </div>
                        `;
                    }
                },
            ],
        });
    }

    // Action Button Click Event
    $(document).on("click.tablebtnclicks", "a.ps_user_table_edit_btn", function(){

        if ($(this).data('activate')) {
            deactivate_activate = $(this).data('activate');
        }

        var dataId = $(this).data('getid');
        var getname = $(this).data('getname');
        let getdata = $(this).data('getdata');
        var thisElement = $(this);
        //Check if button clicked is the delete or edit
        if (getname === "delete_user") {
            //Delete warning alert
            Toast.fire({
                title: 'Are you sure?',
                text: 'You want to delete '+(getdata)+ '?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!'
            }).then(function(result) {
                //Check if yes is clicked
                if (result.value) {
                    //Delete Item
                    if (deleteUser(getname, dataId, getdata)) {
                        //Result alert
                        Toast.fire(
                            'Deleted!',
                            'Item has been deleted.',
                            'success'
                        )
                    }
                }
            });
        } else if (getname === "deactivate_user") {
            //Deactivate warning alert
            let mssg;
            if (deactivate_activate == "activate") {
                mssg = 'Are you sure you want to reactivate '+getdata+ '?';
            } else {
                mssg = 'Are you sure you want to deactivate '+getdata+ '?';
            }
            Toast.fire({
                title: "Are you sure?",
                text: mssg,
                icon: "warning",
                showConfirmButton : true,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, do it!"
            }).then((result) => {
            if (result.isConfirmed) {
                //Check if yes is clicked
                if (result.value) {
                    //Delete Item
                    if (deactivateUser(getname, dataId, deactivate_activate)) {
                        let title; 
                        if (deactivate_activate == "activate") {
                            title = 'Reactivate successful';
                            mssg = 'is reactivated.';
                        } else {
                            title = 'Deactivate successful';
                            mssg = 'is deactivated.';
                        }
                        //Result alert
                        Toast.fire(
                            title,
                            getdata + ' ' + mssg,
                            'success'
                        )
                    }
                }
            }
            });
            
        } else if(getname == 'specific_department') {
            let maindata = JSON.stringify(thisElement.data("maindata")).replace(/:::/g, "'");
            maindata = JSON.parse(maindata);
            //assign department method
            assignDepartment(maindata);

        } else {
            //Update data method
            updateUser(getname, dataId);
        }
    });

    //Update function
    function updateUser(getname, dataId) {
        socket.off('table');
        socket.off(melody.melody1+'_'+getname); 

        socket.emit('specific', {
            "melody1": melody.melody1,
            "melody2": melody.melody2,
            "melody3": melody.melody3,
            "param": getname,
            "dataId": dataId
        });

        socket.on(melody.melody1+'_'+getname, (data)=>{
            if (data.type == 'error') {
                Toast.fire(
                    'Error',
                    data.message,
                    'warning'
                )
            } else {
                $('.ps_manage_user_submit_btn').html('Update');
                if (data) {
                    $('.ps_manage_user_hiddenid').val(data.userID);
                    $('.ps_user_firstName').val(data.firstName); 
                    $('.ps_user_lastName').val(data.lastName);
                    $('.ps_user_email').val(data.email);
                    $('.ps_user_phone').val(data.phone);
                    $('.ps_user_address').val(data.address);
                    $('.ps_user_username').val(data.username);
                    $('.ps_user_role_dropdown').val(data.roleID).change();
                } else {
                    $('.ps_manage_user_hiddenid').val('');
                    $('.ps_user_firstName').val('');
                    $('.ps_user_lastName').val('');
                    $('.ps_user_email').val('');
                    $('.ps_user_phone').val('');
                    $('.ps_user_address').val('');
                    $('.ps_user_username').val('');
                    $('.ps_user_password').val('');
                    $('.ps_user_confirm_password').val('');
                    $('.ps_user_role_dropdown').val('').change();
                    Toast.fire(
                        'Oops!!',
                        'Fetching to edit ended up empty',
                        'warning'
                    )
                }
            }
        });
    }

    // Deactivate function
    function deactivateUser(getname, dataId, deactivate_activate) {
        socket.off('deactivate');
        socket.off(melody.melody1+'_'+getname); 

        socket.emit('deactivate', {
            melody1: melody.melody1,
            melody2: melody.melody2,
            param: getname,
            dataId: dataId,
            checker: deactivate_activate
        });

        //Response from deactivate
        socket.on(melody.melody1+'_'+getname, (data)=>{
            if (data['type'] == 'error') {
                console.log(data['message']);
                return false;
            } else if (data.type == "caution") {
                Toast.fire({
                    text: data.message,
                    type: 'warning',
                    padding: '1em'
                })
                return false;
            } else {
                UserTableFetch();
                return true;
            } 
        });
    }

    // Assign Department function
    function assignDepartment(maindata) {
        if (maindata) {
            $('.ps_user_assign_department_hiddenid').val(maindata.userID);
        } else {
            $('.ps_user_assign_department_hiddenid').val('');
        }
        $('.ps_user_assign_department_modal_btn').trigger('click');
        departmentDropdown();
    }

    //Delete function
    function deleteUser(getname, dataId, getdata) {
        socket.off('delete');
        socket.off(melody.melody1+'_'+getname); 

        socket.emit('delete', {
            "melody1": melody.melody1,
            "melody2": melody.melody2,
            "param": getname,
            "dataId": dataId
        });

        //Response from delete
        socket.on(melody.melody1+'_'+getname, function(data){
            if (data.type == "error") {
                console.log(data.message);
            } else if (data.type == "caution") {
                Toast.fire({
                    text: data.message,
                    type: 'warning',
                    padding: '1em'
                })
                return false;
            } else{
                Toast.fire(
                    'Deletion successful',
                    getdata.toUcwords() + ' has been deleted',
                    'success'
                )
                UserTableFetch();
            }
        });
    }
    
    roleDropdown();
    function roleDropdown() {
        socket.off('dropdown');
        socket.off(melody.melody1+'_role_dropdown');

        socket.emit('dropdown', {
            melody1: melody.melody1,
            melody2: melody.melody2,
            param: 'role_dropdown'
        });

        socket.on(melody.melody1+'_role_dropdown', (data)=>{
            if (data.type == 'error') {
                console.log(data.message);
            } else {
                $('.ps_user_role_dropdown').html('<option value="" selected>Select Role</option>');
                data.forEach(item => {
                    $('.ps_user_role_dropdown').append(`<option value="${item.roleID}"> ${item.role.toUcwords()} </option>`);
                });
            }
        });
    }

    function departmentDropdown() {
        socket.off('dropdown');
        socket.off(melody.melody1+'_department_dropdown');

        socket.emit('dropdown', {
            melody1: melody.melody1,
            melody2: melody.melody2,
            param: 'department_dropdown'
        });

        socket.on(melody.melody1+'_department_dropdown', (data)=>{
            if (data.type == 'error') {
                console.log(data.message);
            } else {
                $('.ps_user_assign_department_dropdown').html('<option value="" selected>Select Department</option>');
                data.forEach(item => {
                    $('.ps_user_assign_department_dropdown').append(`<option value="${item.departmentID}"> ${item.department.toUcwords()} </option>`);
                });
            }
        });
    }

});

