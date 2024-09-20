
$(document).ready(function () {

    // Global Variable & Functions here
    let holdUser;
    DepartmentTableFetch();
    
    // Form Submit
    $(document).on('submit', 'form.ps_manage_department_form', function (e) {
        e.preventDefault();

        //Get form data from html
        let ps_manage_department_hiddenid = $('.ps_manage_department_hiddenid', this).val();
        let ps_manage_department_name = $('.ps_manage_department_name', this).val();
        let ps_department_description = $('.ps_department_description', this).val();

        //Setting submit button to loader
        $('.ps_manage_department_submit_btn').html('<div class="mr-2 spinner-border align-self-center loader-sm"></div>');
        //Diable submit button
        $('.ps_manage_department_submit_btn').attr('disabled', 'disabled');
        
        socket.off('insertNewDepartment');
        socket.off(melody.melody1+'_insertNewDepartment'); 

        setTimeout(function () {
            socket.emit('insertNewDepartment', {
                "melody1": melody.melody1,
                "melody2": melody.melody2,
                "ps_manage_department_hiddenid": ps_manage_department_hiddenid,
                "ps_manage_department_name": ps_manage_department_name,
                "ps_department_description": ps_department_description
            });
        }, 500);

        //Get response from submit
        socket.on(melody.melody1 + '_insertNewDepartment', function (data) {
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
                $('.ps_manage_department_form').trigger('reset');
                socket.off(melody.melody1+'_insertNewDepartment'); 
                DepartmentTableFetch();
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
            $('.ps_manage_department_submit_btn').html('Submit');
            //Enable submit button
            $('.ps_manage_department_submit_btn').removeAttr('disabled');
        });

    });

    //Department Table Fetch
    function DepartmentTableFetch(){
        socket.off('table');
        socket.off(melody.melody1+'_department_table'); 

        socket.emit('table', {
            melody1: melody.melody1,
            melody2: melody.melody2,
            param: 'department_table'
        });

        // User Table Emit Response
        socket.on(melody.melody1 + '_department_table', (data) => {
            if (data.type == 'error') {
                console.log(data.message);
            } else {
                departmentDataTable(data);
            }
        });
    }

    //Data table creation function
    function departmentDataTable(dataJSONArray) {
        reCreateMdataTable('ps_department_data_table', 'ps_department_data_table_div');
        const datatable = $('.ps_department_data_table').mDatatable({
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10
            },
            search: {
                input: $('#ps_department_general_search'),
            },
            columns: [
                {
                    field: 'department',
                    title: "Department",
                    type: 'text',
                    template: function (row) {
                        return (row.department).toUcwords();
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
                                                return `<span class="badge badge-danger"> ${row.status.toUcwords()} </span>`;
                                            }
                                        }
                                    },
                                    {
                                        field: 'action',
                                        title: 'Action',
                                        template: function (row) {
                        let activateOrDeactivate, validate_delete;
                
                        if (row.status == "d") {
                            activateOrDeactivate = `<a href="#" class="dropdown-item ps_department_table_edit_btn" data-getid="${row.departmentID}" data-getname="deactivate_department" data-getdata="${row.department.toUcwords()}" data-activate="activate"><i class="icon-checkmark3 mr-2"></i> Reactivate</a>`;
                        } else {
                            activateOrDeactivate = `<a href="#" class="dropdown-item ps_department_table_edit_btn" data-getid="${row.departmentID}" data-getname="deactivate_department" data-getdata="${row.department.toUcwords()}" data-activate="deactivate"><i class="icon-blocked mr-2"></i> Deactivate</a>`;
                        }
                
                        if ($('.hidden_delete_for_admin').val() == 'admin') {
                            validate_delete = `<a href="#" class="dropdown-item ps_department_table_edit_btn" data-getid="${row.departmentID}" data-getname="delete_department" data-getdata="${row.department.toUcwords()}"><i class="icon-close2 mr-2"></i> Delete</a>`;
                        } else {
                            validate_delete = '';
                        }
                
                        return `
                            <div class="dropdown" > 
                                <a href="#" class="  m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">
                                    <i class="icon-menu7" style="font-size:20px"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="ps_department_table_edit_btn dropdown-item" href="#" data-getid="`+ row.departmentID + `" data-getname="specific_department"><i class="icon-add mr-2"></i></i>Assign User</a> 
                                    <a class="ps_department_table_edit_btn dropdown-item" href="#" data-getid="`+ row.departmentID + `" data-getname="specific_department"><i class="icon-pencil mr-2"></i></i>Edit Details</a> 
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
    $(document).on("click.tablebtnclicks", "a.ps_department_table_edit_btn", function(){

        if ($(this).data('activate')) {
            deactivate_activate = $(this).data('activate');
        }

        var dataId = $(this).data('getid');
        var getname = $(this).data('getname');
        let getdata = $(this).data('getdata');
        var thisElement = $(this);
        //Check if button clicked is the delete or edit
        if (getname === "delete_department") {
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
                    if (deleteDepartment(getname, dataId, getdata)) {
                        //Result alert
                        Toast.fire(
                            'Deleted!',
                            'Item has been deleted.',
                            'success'
                        )
                    }
                }
            });
        } else if (getname === "deactivate_department") {
            //Deactivate warning alert
            let mssg;
            if (deactivate_activate == "activate") {
                mssg = 'Are you sure you want to reactivate '+getdata+ '?';
            } else {
                mssg = 'Are you sure you want to deactivate '+getdata+ '?';
            }
            Toast.fire({
                text: mssg,
                icon: "warning",
                showConfirmButton : true,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, do it !",
            }).then((result) => {
            if (result.isConfirmed) {
                //Check if yes is clicked
                if (result.value) {
                    //Delete Item
                    if (deactivateDepartment(getname, dataId, deactivate_activate)) {
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
            updateDepartment(getname, dataId);
        }
    });

    //Update function
    function updateDepartment(getname, dataId) {
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
                $('.ps_manage_department_submit_btn').html('Update');
                if (data) {
                    $('.ps_manage_department_hiddenid').val(data.departmentID);
                    $('.ps_manage_department_name').val(data.department.toUcwords());
                    $('.ps_department_description').val(data.description);
                } else {
                    $('.ps_manage_department_name').val('');
                    $('.ps_department_description').val('');
                    $('.ps_manage_department_hiddenid').val('');
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
    function deactivateDepartment(getname, dataId, deactivate_activate) {
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
                DepartmentTableFetch();
                return true;
            } 
        });
    }

    //Delete function
    function deleteDepartment(getname, dataId, getdata) {
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
                DepartmentTableFetch();
            }
        });
    }
    
    //User Dropdown
    userDropdown();
    function userDropdown() {
        socket.off('dropdown');
        socket.off(melody.melody1 + '_user_dropdown');

        socket.emit('dropdown', {
            melody1: melody.melody1,
            melody2: melody.melody2,
            param: "user_dropdown"
        });

        //Get dropdown data
        socket.on(melody.melody1 + '_user_dropdown', function (data) {
            //Get json content from login code
            if (data.type == "error") {
                console.log(data.message);
            } else {
                $('select.ps_manage_department_user').html(`<option value="" ${holdUser !== undefined ? '' : 'selected'}> Select User </option>`);
                data.forEach(function (item, index) {

                    $('select.ps_manage_department_user').append(`<option value="${item.userID}"> ${item.userID}</option>`);
                });
            }
        });
    }

});

