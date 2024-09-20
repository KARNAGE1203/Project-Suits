function Document() {
$('.ps_main_page_breadcrumb').html(`Manage Document`);
$('.ps_main_page_breadcrumb_navigation').html(`Manage Document`);

    return `
        <div class="layout-px-spacing mb-5">
            <div class="row layout-top-spacing">
                <div class="col-md-12" id="ps_document_page_form_display"></div>
            </div>
        </div>
    `;
}


function DocumentForm() {
return `
        <div class="card">
            <div class="card-body">
                <form action="" class="ps_document_form">
                    <input type="hidden" name="" class="ps_manage_document_hiddenid">
                    <div class="row mb-4">
                        <div class="col-md-12 mt-3 ps_dropzone_action">
                            <label for=""> Upload Document</label>
                            <div class="w-100 ps_dropzone_input" id="ps_dropzone_input"></div>
                        </div>

                        <div class="col-md-12 mt-3">
                            <label>Give names to selected files (Use comma separated Values). eg. new name one, new name
                                two</label>
                            <input type="text" class="form-control ps_document_upload_dropzone_rename"
                                placeholder="Give names to selected files (Use comma separated Values)">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <button type="submit" class="btn btn-primary ps_document_submit float-right">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="card component-card_1 mb-5 mt-3">
            <div class="card-body ps_document_data_table_div">
                <div class="row mb-4">
                    <div class="col-md-12">
                        <label for="">Search By Document name</label>
                        <div class="form-inline">
                            <div class="input-group" >
                                <input class="form-control form-control-sidebar ps_document_general_search"  placeholder="Search"  id ="ps_document_general_search">
                                <div class="input-group-append">
                                    <button class="btn btn-sidebar">
                                        <i class="fas fa-fw fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="ps_document_data_table" style="text-align:left"></table>
            </div>
        </div>
    `;
}

function assignUserModal() {
    return `
        <button type="button" class="ps_document_assign_user_modal_btn hide" data-toggle="modal" data-target="#assignUserModal"></button>
        <div class="modal fade" id="assignUserModal" tabindex="-1" role="dialog" aria-labelledby="assignUserModal" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary">
                        <h5 class="modal-title text-white" id="exampleModalLabel">Assign Document to User</h5>
                    </div>
                    <div class="modal-body">
                        <form class="ps_document_assign_user_form" action="" >
                            <input type="hidden" class="ps_document_assign_user_hiddenid">
                            <div class="row">
                                <div class="col-md-12 mt-2">
                                    <label for="">User <span class="text-danger">*</span></label>
                                    <select class="form-control ps_document_assign_user_dropdown">
                                        <option value="" selected> Select User </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mt-3 text-right">
                                    <button class="btn mr-2" data-dismiss="modal"><i class="flaticon-cancel-12"></i> Discard</button>
                                    <button class="btn bg-primary ps_document_assign_user_submit_btn" type="submit"> Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

(()=>{
let html = ejs.render(Document(), {});
$('#ps_main_content_display').html(html);

html = ejs.render(DocumentForm(), {});
$('#ps_document_page_form_display').html(html);

html = ejs.render(assignUserModal(), {});
$('#ps_main_content_display').append(html);


addExternalScript('assets/js/DropZone.js');


addPageScript('documentAjax');
})();