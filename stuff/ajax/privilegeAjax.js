(()=>{
    
    
    //================================================================================//
    // FORM SUBMIT

        //Set privilege
        $(document).on('click.otherclicks', 'input.checkBox', function() {
            let columnName = $(this).data("column");
            let user_privilege = $('.ps_privilege_user').val();
            let group_privilege = $('.ps_privilege_group').val();
            let category = $(this).data('category');
            let table = $(this).data('table');
            let dataValue, begin_mssg, add_mssg, main_mssg;
            let thisChecker = $(this);

            if ($(this).is(':checked')) {
                dataValue = "yes";
                begin_mssg = "Enabling";
                add_mssg = "will make a user or group";
            } else {
                dataValue = "no";
                begin_mssg = "Disabling";
                add_mssg = "will make the user or group unable to";
            }

            $('.' + category).prop('checked', true);

            let title = columnName.replace(/_/g, ' ');
            let splitData = columnName.split('_');
            if (splitData[0] == 'update') {
                main_mssg = begin_mssg + " '" + title.toUpperCase() + "' privilege " + add_mssg + " update contents";
            } else if (splitData[0] == 'deactivate') {
                main_mssg = begin_mssg + " '" + title.toUpperCase() + "' privilege " + add_mssg + " deactivate records from this functionality";
            } else if (splitData[0] == 'func') {
                main_mssg = begin_mssg + " '" + title.toUpperCase() + "' privilege " + add_mssg + " see all related functionalities under this function";
            } else {
                main_mssg = begin_mssg + " '" + title.toUpperCase() + "' privilege " + add_mssg + " create or add new records";
            }

            Toast.fire({
                title: 'Caution',
                text: main_mssg,
                type: 'warning',
                showConfirmButton : true,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            }).then(function(result) {
                //Check if yes is clicked
                if (result.value) {
                    singleCheckbox(table, columnName, category, dataValue, user_privilege, group_privilege);
                } else {
                    if ($('.' + columnName).is(':checked')) {
                        $('.' + columnName).prop('checked', false);
                        $('.' + category).prop('checked', false);
                    } else {
                        $('.' + columnName).prop('checked', true);
                        $('.' + category).prop('checked', true);
                    }
                }
            });
        });

        //Check only one check box (single checkbox)
        function singleCheckbox(table, columnName, category, dataValue, user_privilege, group_privilege) {
            socket.emit('privilege', {
                melody1: melody.melody1,
                melody2: melody.melody2,
                table: table,
                columnName: columnName,
                dataValue: dataValue,
                category: category,
                user: user_privilege,
                group: group_privilege,
                param: 'set_one_privilege'
            });

            socket.on(melody.melody1+'_set_one_privilege', (data)=>{
                if (data.type == "error") {
                    if ($('.' + columnName).is(':checked')) {
                        $('.' + columnName).prop('checked', false);
                        $('.' + category).prop('checked', false);
                    } else {
                        $('.' + columnName).prop('checked', true);
                        $('.' + category).prop('checked', true);
                    }
                    Toast.fire({
                        title: 'Warning',
                        text: data['message'],
                        type: 'warning'
                    });
                } else {
                    reArrangeSideBar(user_privilege);
                    // console.log(data['message']);
                }
            });
        }

        //Check all privilege event
        $(document).on('click.otherclicks', 'input.checkBoxAll', function() {
            let column = $(this).data('column');
            let user = $('.ps_privilege_user').val();
            let group = $('.ps_privilege_group').val();
            let table = $(this).data('table');
            let dataValue = "yes", mssg;

            if ($(this).is(':checked')) {
                if (column == "functions") {
                    mssg = `Enabling this will make all functionalities visible to a User or Group`;
                } else {
                    mssg = `Enabling this will allow a User or Group to add new records, update records and deactivate records from the various functionalities checked`;
                }
            } else {
                dataValue = "no";
                if (column == "functions") {
                    mssg = `Disabling this will make all functionalities invisible to a User or Group`;
                } else {
                    mssg = `Disabling this will make User or group unable to add new records, update records and deactivate records from the various functionalities checked`;
                }
            }

            Toast.fire({
                title: 'Caution',
                text: mssg,
                type: 'warning',
                showConfirmButton : true,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            }).then(function(result) {
                //Check if yes is clicked
                if (result.value) {
                    checkUncheckAll(column, dataValue);
                    activateDeactivateCheckbox(table, column, group, user, dataValue);
                } else {
                    if ($('.' + column).is(':checked')) {
                        $('.' + column).prop('checked', false);
                    } else {
                        $('.' + column).prop('checked', true);
                    }
                }
            });
        });

        //Activate or deactivate all checkBox
        function activateDeactivateCheckbox(table, column, group, user, dataValue) {
            socket.emit('privilege', {
                melody1: melody.melody1,
                melody2: melody.melody2,
                param: "set_all_privilege",
                table: table,
                // column: column,
                role: group,
                user: user,
                dataValue: dataValue
            });

            socket.on(melody.melody1+'_set_all_privilege', (data)=>{
                if (data.type == 'error') {
                    if ($('.' + column).is(':checked')) {
                        checkUncheckAll(column, 'no');
                    } else {
                        checkUncheckAll(column, 'yes');
                    }
                    Toast.fire({
                        title: 'Warning',
                        text: data['message'],
                        type: 'warning'
                    });
                } else {
                    reArrangeSideBar(user);
                    // console.log(data['message']);
                }
            });
        }

        //Funtion to activate all checkboxes
        function checkUncheckAll(column, condition) {
            if (condition == 'yes') {
                $('.group_'+column).prop('checked', true);
            } else {
                $('.group_'+column).prop('checked', false);
            }
        }


    //================================================================================//
    // DROPDOWNS
        //dropdowns
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
                    $('.ps_privilege_role_dropdown').html('<option value="" selected>Select Role</option>');
                    data.forEach(item => {
                        $('.ps_privilege_role_dropdown').append(`<option value="${item.roleID}"> ${item.role.toUcwords()} </option>`);
                    });
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
                    $('select.ps_privilege_user').html('<option value="" selected>Select User</option>');
                    data.forEach(item => {
                        $('select.ps_privilege_user').append(`<option value="${item.userID}"> ${item.username}</option>`);
                    });
                }
            });
        }

        //Onchange user fetch
        $(document).on('change', 'select.ps_assign_privilege_department', function() {
            socket.off('dropdown');
            socket.off(melody.melody1+'_user_department');

            let dataId = $(this).val();
            if (dataId == "" || dataId == undefined) {
                userDropdown();
            } else {
                socket.emit('dropdown', {
                    melody1: melody.melody1,
                    melody2: melody.melody2,
                    param: 'user_department',
                    dataId: dataId
                });
            }

            socket.on(melody.melody1+'_user_department', (data)=>{
                if (data.type == 'error') {
                    console.log(data.message);
                } else {
                    $('.ps_privilege_user').html('<option value="" selected>Select User</option>');
                    data.forEach(item => {
                        let fullname = item.first_name + ' ' + ((item.other_name == "" || item.other_name == undefined) ? '' : item.other_name) + item.last_name;
                        $('.ps_privilege_user').append(`<option value="${item.userid}"> ${fullname.toUcwords()} </option>`);
                    });
                    makeAllSelectLiveSearch('ps_privilege_user', 'Select User');
                }
            });
        });

        $(document).on('change', 'select.ps_create_department', function() {
            socket.off('dropdown');
            socket.off(melody.melody1+'_user_department');

            let dataId = $(this).val();
            
            if (dataId == "" || dataId == undefined) {
                userDropdown();
            } else {
                socket.emit('dropdown', {
                    melody1: melody.melody1,
                    melody2: melody.melody2,
                    param: 'user_department',
                    dataId: dataId
                });
            }

            socket.on(melody.melody1+'_user_department', (data)=>{
                if (data.type == 'error') {
                    console.log(data.message);
                } else {
                    $('.ps_create_user').html('<option value="" selected>Select User</option>');
                    data.forEach(item => {
                        let fullname = item.first_name + ' ' + ((item.other_name == "" || item.other_name == undefined) ? '' : item.other_name) + item.last_name;
                        $('.ps_create_user').append(`<option value="${item.departmentid}"> ${fullname.toUcwords()} </option>`);
                    });
                    makeAllSelectLiveSearch('ps_privilege_user', 'Select User');
                }
            });
        });

        //Fetch for privileges by user
        $(document).on('change', 'select.ps_privilege_user', function(){
            let dataId = $(this).val();
            if (dataId == "") {
                $('input.checkBox, input.checkBoxAll').prop('checked', false);
            } else {
                socket.emit('specific', {
                    melody1: melody.melody1,
                    melody2: melody.melody2,
                    param: "specific_privilege",
                    dataId: dataId
                });
            }

            //Get response for specific privilege
            socket.on(melody.melody1+'_specific_privilege', (data)=>{
                if (data.type == "error") {
                    $('input.checkBox').prop('checked', false);
                    console.log(data['message']);
                } else {
                    if (data.length < 1 || data == undefined) {
                        $('input.checkBox').prop('checked', false);
                    } else {
                        setCheckboxProp(data);
                    }
                }
            });
        });

        //Set prop to true or false
        function setCheckboxProp(data) {
            let privilegeName;
            for (privilegeName in data) {
                if (data[privilegeName] == "yes") {
                    $('input.' + privilegeName).prop('checked', true);
                } else {
                    $('input.' + privilegeName).prop('checked', false);
                }
            }
        }

    
    //================================================================================//
    // OTHER FUNCTIONS AND EVENTS

        //Re-arrange sidebar
        function reArrangeSideBar(user) {
            if (user !== "" || user !== undefined) {
                socket.off('specific');
                socket.emit('specific', {
                    melody1: melody.melody1,
                    melody2: melody.melody2,
                    param: 'get_user_privileges',
                    user: user
                });
            }
        }

        //Re-arrange sidebar base on privilege settings for a particular user
        socket.on(melody.melody2+'_get_user_privileges', (data)=>{
            console.log(data);
            if (data.type == 'error') {
                console.log(data.message);
            } else {
                if (data.pearson_specter.add_privilege != undefined) {
                    $('.hidden_privilege_data').val(JSON.stringify(data));
                    let html = ejs.render(Sidebar(), {privilege: data});
                    document.getElementById('navbar_overall_parent').innerHTML = html;
                }
            }
        });
})()