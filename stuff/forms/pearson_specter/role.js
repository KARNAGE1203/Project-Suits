
function Role() {
    $('.ps_main_page_breadcrumb').html(`Manage Role`);
    $('.ps_main_page_breadcrumb_navigation').html(`Manage Role`);

    return `
        <div class="layout-px-spacing mb-5">
            <div class="row layout-top-spacing">
                <div class="col-md-12" id="ps_role_page_form_display"></div>
            </div>
        </div>
    `;
}


function RoleForm() {
    return `
        <div class="card">
            <div class="card-body">
                <form action="" class="ps_manage_role_form">
                    <input type="hidden" name="" class="ps_manage_role_hiddenid">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group mb-4">
                                <label>Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control ps_role_name" placeholder="Name" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group mb-4">
                                <label>Description </label>
                                <textarea name=""  placeholder="Description" class="form-control ps_role_description" rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <button type="submit" class="btn btn-primary ps_role_submit float-right">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="card component-card_1 mb-5 mt-3">
        <div class="card-body ps_role_data_table_div">
            <div class="row mb-4">
                <div class="col-md-12">
                    <label for="">Search By Role or Description</label>
                    <div class="form-inline">
                        <div class="input-group" >
                            <input class="form-control form-control-sidebar ps_role_general_search"  placeholder="Search"  id ="ps_role_general_search">
                            <div class="input-group-append">
                                <button class="btn btn-sidebar">
                                    <i class="fas fa-fw fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table class="ps_role_data_table" style="text-align:left"></table>
        </div>
    </div>
    `;
}

(()=>{
    let html = ejs.render(Role(), {});
    $('#ps_main_content_display').html(html);

    html = ejs.render(RoleForm(), {});
    $('#ps_role_page_form_display').html(html);

    addPageScript('roleAjax');
})();