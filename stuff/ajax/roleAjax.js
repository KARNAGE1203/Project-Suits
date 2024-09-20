
$(document).ready(function () {

    RoleTableFetch();
    // Global Variable & Functions here    
    // Form Submit
    $(document).on('submit', 'form.ps_manage_role_form', function (e) {
        e.preventDefault();

        //Get form data from html
        let ps_manage_role_hiddenid = $('.ps_manage_role_hiddenid', this).val();
        let ps_manage_role_name = $('.ps_role_name', this).val();
        let ps_role_description = $('.ps_role_description', this).val();

        //Setting submit button to loader
        $('.ps_role_submit').html('<div class="mr-2 spinner-border align-self-center loader-sm"></div>');
        //Diable submit button
        $('.ps_role_submit').attr('disabled', 'disabled');
        
        socket.off('insertNewRole');
        socket.off(melody.melody1+'_insertNewRole'); 

        setTimeout(function () {
            socket.emit('insertNewRole', {
                "melody1": melody.melody1,
                "melody2": melody.melody2,
                "ps_manage_role_hiddenid": ps_manage_role_hiddenid,
                "ps_manage_role_name": ps_manage_role_name,
                "ps_role_description": ps_role_description
            });
        }, 500);

        //Get response from submit
        socket.on(melody.melody1 + '_insertNewRole', function (data) {
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
                $('.ps_manage_role_form').trigger('reset');
                socket.off(melody.melody1+'_insertNewRole'); 
                RoleTableFetch();
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
            $('.ps_role_submit').html('Submit');
            //Enable submit button
            $('.ps_role_submit').removeAttr('disabled');
        });

    });

    //Role Table Fetch
    function RoleTableFetch(){
        socket.off('table');
        socket.off(melody.melody1+'_role_table'); 

        socket.emit('table', {
            melody1: melody.melody1,
            melody2: melody.melody2,
            param: 'role_table'
        });

        // User Table Emit Response
        socket.on(melody.melody1 + '_role_table', (data) => {
            if (data.type == 'error') {
                console.log(data.message);
            } else {
                roleDataTable(data);
            }
        });
    }

    //Data table creation function
    function roleDataTable(dataJSONArray) {
        reCreateMdataTable('ps_role_data_table', 'ps_role_data_table_div');
        const datatable = $('.ps_role_data_table').mDatatable({
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10
            },
            search: {
                input: $('#ps_role_general_search'),
            },
            columns: [
                {
                    field: 'role',
                    title: "Role",
                    type: 'text',
                    template: function (row) {
                        return (row.role);
                    }
                },
                {
                    field: 'description',
                    title: "Description",
                    type: 'text'
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
                
                        if (row.status == "d") {
                            activateOrDeactivate = `<a href="#" class="dropdown-item ps_role_table_edit_btn" data-getid="${row.roleID}" data-getname="deactivate_role" data-getdata="${row.role}" data-activate="activate"><i class="icon-checkmark3 mr-2"></i> Reactivate</a>`;
                        } else {
                            activateOrDeactivate = `<a href="#" class="dropdown-item ps_role_table_edit_btn" data-getid="${row.roleID}" data-getname="deactivate_role" data-getdata="${row.role}" data-activate="deactivate"><i class="icon-blocked mr-2"></i> Deactivate</a>`;
                        }
                
                        if ($('.hidden_delete_for_admin').val() == 'admin') {
                            validate_delete = `<a href="#" class="dropdown-item ps_role_table_edit_btn" data-getid="${row.roleID}" data-getname="delete_role" data-getdata="${row.role}"><i class="icon-close2 mr-2"></i> Delete</a>`;
                        } else {
                            validate_delete = '';
                        }
                
                        return `
                            <div class="dropdown" > 
                                <a href="#" class="  m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">
                                    <i class="icon-menu7" style="font-size:20px"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="ps_role_table_edit_btn dropdown-item" href="#" data-getid="`+ row.roleID + `" data-getname="specific_role"><i class="icon-pencil mr-2"></i></i>Edit Details</a> 
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
    $(document).on("click.tablebtnclicks", "a.ps_role_table_edit_btn", function(){

        if ($(this).data('activate')) {
            deactivate_activate = $(this).data('activate');
        }

        var dataId = $(this).data('getid');
        var getname = $(this).data('getname');
        let getdata = $(this).data('getdata');
        var thisElement = $(this);
        //Check if button clicked is the delete or edit
        if (getname === "delete_role") {
            //Delete warning alert
            Toast.fire({
                title: 'Are you sure?',
                text: 'You want to delete '+(getdata)+ '?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, do it!'
            }).then(function(result) {
                //Check if yes is clicked
                if (result.value) {
                    //Delete Item
                    if (deleteRole(getname, dataId, getdata)) {
                        //Result alert
                        Toast.fire(
                            'Deleted!',
                            'Item has been deleted.',
                            'success'
                        )
                    }
                }
            });
        } else if (getname === "deactivate_role") {
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
                    if (deactivateRole(getname, dataId, deactivate_activate)) {
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
            
        } else {
            //Update data method
            updateRole(getname, dataId);
        }
    });

    //Update function
    function updateRole(getname, dataId) {
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
                $('.ps_role_submit').html('Update');

                if (data) {
                    $('.ps_manage_role_hiddenid').val(data.roleID);
                    $('.ps_role_name').val(data.role.toUcwords());
                    $('.ps_role_description').val(data.description);
                } else {
                    $('.ps_role_name').val('');
                    $('.ps_role_description').val('');
                    $('.ps_manage_role_hiddenid').val('');
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
    function deactivateRole(getname, dataId, deactivate_activate) {
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
                RoleTableFetch();
                return true;
            } 
        });
    }

    //Delete function
    function deleteRole(getname, dataId, getdata) {
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
                RoleTableFetch();
            }
        });
    }

});

