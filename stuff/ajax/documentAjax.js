$(document).ready(function () {

    // Dropzone
    let dropZoneIcons = {
        pdf: '<div class="fa fa-file-pdf fa-5x text-danger d-block w-100 h-70"></div>',
        doc: '<div class="fa fa-file-word fa-5x text-danger-400 d-block w-100 h-70"></div>',
        spreadsheet: '<div class="fa fa-file-excel fa-5x text-danger-400 d-block w-100 h-70"></div>',
        other: '<div class="fa fa-file-archive fa-5x text-danger-400 d-block w-100 h-70"></div> '
    }

    let holdUser;

    //Submit form
    $(document).on('submit', 'form.ps_document_form', function (e) {
        e.preventDefault();
    
        let ps_document_upload_dropzone_rename = $('.ps_document_upload_dropzone_rename', this).val();
        let ps_manage_document_hiddenid = $('.ps_manage_document_hiddenid', this).val();
    
        //Setting submit button to loader
        $('.ps_document_submit').html('<div class="mr-2 spinner-border align-self-center loader-sm"></div>');
        //Disable submit button
        $('.ps_document_submit').attr('disabled', 'disabled');
    
        socket.off('insertNewDocument');
        socket.off(melody.melody1 + '_insertNewDocument');

        if (ps_manage_document_hiddenid != undefined || ps_manage_document_hiddenid != null) {
            FileNamesHolder.push.ps_document_upload_dropzone_rename;
        }
    
        setTimeout(function () {
            socket.emit('insertNewDocument', {
                "melody1": melody.melody1,
                "melody2": melody.melody2,
                "ps_document_upload_dropzone_rename": ps_document_upload_dropzone_rename,
                "ps_manage_document_hiddenid": ps_manage_document_hiddenid,
                "DocumentsForUpdate": FilterFileNames(FileNamesHolder)
            }, (data) => {
                if (data.type == 'success') {
                    $('.ps_document_form').trigger('reset');
                    socket.off(melody.melody1 + '_insertNewDocument');
                    pageDropZone();
                }
                Toast.fire({
                    title: data.type == 'success' ? 'Success' : (data.type == 'error' ? 'Error' : 'Caution'),
                    text: data.message,
                    icon: data.type == 'success' ? 'success' : (data.type == 'error' ? 'error' : 'warning'),
                    padding: '0.5em'
                });
                DocumentTableFetch();
                // Set submit button back to its original text
                $('.ps_document_submit').html('Submit');
                //Empty the form 
                $('.ps_document_form').trigger('reset');
                $('.ps_manage_document_hiddenid').val('');
                FileNamesHolder = [];
                // Enable submit button
                $('.ps_document_submit').removeAttr('disabled');
            });
        }, 500);
    });

    // Form submit for assign user
    $(document).on('submit', 'form.ps_document_assign_user_form', function (e) {

        e.preventDefault();
        let ps_document_assign_user_hiddenid = $('.ps_document_assign_user_hiddenid', this).val();
        let ps_document_assign_user_dropdown = $('.ps_document_assign_user_dropdown', this).val();

        //Setting submit button to loader
        $('.ps_document_assign_user_submit_btn').html('<div class="mr-2 spinner-border align-self-center loader-sm"></div>');
        //Diable submit button
        $('.ps_document_assign_user_submit_btn').attr('disabled', 'disabled');

        socket.off('specific'); 
        socket.off(melody.melody1+'_specific'); 

        socket.emit('specific', {
            "melody1": melody.melody1,
            "melody2": melody.melody2,
            "melody3": melody.melody3,
            "param": 'assign_user',
            "hiddenID": ps_document_assign_user_hiddenid,
            "userID": ps_document_assign_user_dropdown
        });

        socket.on(melody.melody1 + '_assign_user', function (data) {   
            if (data.type == "success") {
                //trigger alert using the alert function down there
                Toast.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    padding: '1em'
                })

                //Empty the form 
                $('.ps_document_assign_user_form').trigger('reset');
                socket.off(melody.melody1+'_assign_user'); 
                DocumentTableFetch();
            } else if (data.type == "caution") {
                Toast.fire({
                    title: 'Caution',
                    text: data.message,
                    icon: 'warning',
                    padding: '1em'
                })
            } else {
                //trigger alert 
                Toast.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                    padding: '1em'
                })
            }
            //Set submit button back to its original text
            $('.ps_document_assign_user_submit_btn').html('Submit');
            //Enable submit button
            $('.ps_document_assign_user_submit_btn').removeAttr('disabled');
        }
        );
    }
    );

    //Document Table Fetch
    DocumentTableFetch();
    function DocumentTableFetch(){
        socket.off('table');
        socket.off(melody.melody1+'_document_table'); 

        socket.emit('table', {
            melody1: melody.melody1,
            melody2: melody.melody2,
            param: 'document_table'
        });

        // User Table Emit Response
        socket.on(melody.melody1 + '_document_table', (data) => {
            if (data.type == 'error') {
                console.log(data.message);
            } else {
                documentDataTable(data);
            }
        });
    }

    //Data table creation function
    function documentDataTable(dataJSONArray) {
        reCreateMdataTable('ps_document_data_table', 'ps_document_data_table_div');
        const datatable = $('.ps_document_data_table').mDatatable({
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10
            },
            search: {
                input: $('#ps_document_general_search'),
            },
            columns: [
                {
                field: 'fileName',
                title: "Document",
                type: 'text',
                template: function (row){
                    let docsHtml = `<div class="col-md-6"> 
                                        <a  href="uploads/${row.fileName}" download="${row.fileName}"> 
                                            <span class="icon-file-pdf icon-2x">
                                            </span>
                                            <br> <p class="mt-1">${row.fileName.toUcwords() }<p>
                                        </a> 
                                    </div>`;
                    return docsHtml;
                }
                },
                {
                    field: 'dateTime',
                    title: "Date Uploaded",
                    type: 'text',
                template: function (row) {
                    return (row.dateTime).fullDate();
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
                        activateOrDeactivate = `<a href="#" class="dropdown-item ps_document_table_edit_btn" data-getid="${row.documentID}" data-getname="deactivate_document" data-getdata="${row.fileName.toUcwords()}" data-activate="activate"><i class="icon-checkmark3 mr-2"></i> Reactivate</a>`;
                    } else {
                        activateOrDeactivate = `<a href="#" class="dropdown-item ps_document_table_edit_btn" data-getid="${row.documentID}" data-getname="deactivate_document" data-getdata="${row.fileName.toUcwords()}" data-activate="deactivate"><i class="icon-blocked mr-2"></i> Deactivate</a>`;
                    }
            
                    if ($('.hidden_delete_for_admin').val() == 'admin') {
                        validate_delete = `<a href="#" class="dropdown-item ps_document_table_edit_btn" data-getid="${row.documentID}" data-getname="delete_document" data-getdata="${row.fileName.toUcwords()}"><i class="icon-close2 mr-2"></i> Delete</a>`;
                    } else {
                        validate_delete = '';
                    }
                    return `
                        <div class="dropdown" > 
                            <a href="#" class="  m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">
                                <i class="icon-menu7" style="font-size:20px"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right">
                                <a class="ps_document_table_edit_btn dropdown-item" href="#" data-getid="`+ row.documentID + `" data-maindata='${maindata}' data-getname="assign_user"><i class="icon-add mr-2"></i></i>Assign User</a> 
                                <a class="ps_document_table_edit_btn dropdown-item" href="#" data-getid="`+ row.documentID + `" data-getname="specific_document" data-maindata='${maindata}'><i class="icon-pencil mr-2"></i></i>Edit Details</a> 
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
    $(document).on("click.tablebtnclicks", "a.ps_document_table_edit_btn", function(){

        if ($(this).data('activate')) {
            deactivate_activate = $(this).data('activate');
        }

        var dataId = $(this).data('getid');
        var getname = $(this).data('getname');
        let getdata = $(this).data('getdata');
        var thisElement = $(this);
        //Check if button clicked is the delete or edit
        if (getname === "delete_document") {
            //Delete warning alert
            Toast.fire({
                title: 'Are you sure?',
                text: 'You want to delete '+(getdata)+ '?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!'
            }).then(function(result) {
                //Check if yes is clicked
                if (result.value) {
                    //Delete Item
                    if (deleteDocument(getname, dataId, getdata)) {
                        //Result alert
                        Toast.fire(
                            'Deleted!',
                            'Item has been deleted.',
                            'success'
                        )
                    }
                }
            });
        } else if (getname === "deactivate_document") {
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
                    if (deactivateDocument(getname, dataId, deactivate_activate)) {
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
                            'success',
                        )
                        
                    }
                }
            }
            });
            
        } else if(getname == 'assign_user') {
            let maindata = JSON.stringify(thisElement.data("maindata")).replace(/:::/g, "'");
            maindata = JSON.parse(maindata);
            //assign user method
            assignUser(maindata);

        } else {
            let maindata = JSON.stringify(thisElement.data("maindata")).replace(/:::/g, "'");
            maindata = JSON.parse(maindata);
            //Update data method
            updateDocument(maindata);
        }
    });

    function updateDocument(maindata) {
        // pageDropZone();
        if (maindata) {
            if (maindata.fileName) {
                let list = [maindata.fileName];
                for (let i = 0; i < list.length; i++) {
                    FileNamesHolder.push(list[i]+'*^*^any_div');
                }
            }
            $('.ps_manage_document_hiddenid').val(maindata.documentID);
            $('.ps_document_upload_dropzone_rename').val(maindata.fileName);
        } else {
            $('.ps_manage_document_hiddenid').val('');
            $('.ps_document_upload_dropzone_rename').val('');
        }
        $('html, body').animate({scrollTop: 0}, "slow");
    }

    // Deactivate function
    function deactivateDocument(getname, dataId, deactivate_activate) {
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
                    icon: 'warning',
                    padding: '1em'
                })
                return false;
            } else {
                DocumentTableFetch();
                return true;
            } 
        });
    }

    // Assign User function
    function assignUser(maindata) {
        if (maindata) {
            $('.ps_document_assign_user_hiddenid').val(maindata.documentID);
        } else {
            $('.ps_document_assign_user_hiddenid').val('');
        }
        $('.ps_document_assign_user_modal_btn').trigger('click');
        userDropdown();
    }

    //User Dropdown
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
            //Get json content from deactivation code
            if (data.type == "error") {
                console.log(data.message);
            } else {
                $('select.ps_document_assign_user_dropdown').html(`<option value="" ${holdUser !== undefined ? '' : 'selected'}> Select User </option>`);
                data.forEach(function (item, index) {
                    $('select.ps_document_assign_user_dropdown').append(`<option value="${item.userID}"> ${item.userID}</option>`);
                });
            }
        });
    }

    // DropZone Function
    pageDropZone();
    function pageDropZone() {
        setTimeout(function () {
            FileNamesHolder = [];
            UploadChecker = 0;
            DropZone('ps_dropzone_input', '#dcdcdc', dropZoneIcons, {
                requestType: 'socket',
                socketObject: socket,
                socketEvent: 'ps_general_file_upload'
            }, 'application/pdf', 0);

            $('.ps_dropzone_title').text('Click to upload pdf here');
            $('.ps_dropzone_subtitle').text(``);
            $('.ps_dropzone_inner').addClass('mt-4');
        }, 200);
    }
    

});

