function Department() {
$('.ps_main_page_breadcrumb').html(`Manage Department`);
$('.ps_main_page_breadcrumb_navigation').html(`Manage Department`);

return `
    <div class="layout-px-spacing mb-5">
        <div class="row layout-top-spacing">
            <div class="col-md-12" id="ps_department_page_form_display"></div>
        </div>
    </div>
    `;
}

function DepartmentForm() {
return `
    <div class="card">
        <div class="card-body">
            <div class="">
                <form class="ps_manage_department_form">
                    <div class="row">
                        <input type="hidden" class="ps_manage_department_hiddenid">
                        <div class="col-md-12 mt-2">
                            <div class="form-group mb-2">
                                <label>Department Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control ps_manage_department_name"
                                    placeholder="Department Name" required>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12 mt-3">
                            <div class="form-group mb-4">
                                <label>Description </label>
                                <textarea name="" placeholder="Description" class="form-control ps_department_description"
                                    rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 mt-3 text-right">
                            <button class="btn btn-primary ps_manage_department_submit_btn" type="submit"> Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="card component-card_1 mb-5 mt-3">
        <div class="card-body ps_department_data_table_div">
            <div class="row mb-4">
                <div class="col-md-12">
                    <label for="">Search By Department or Description</label>
                    <div class="form-inline">
                        <div class="input-group" >
                            <input class="form-control form-control-sidebar ps_department_general_search"  placeholder="Search"  id ="ps_department_general_search">
                            <div class="input-group-append">
                                <button class="btn btn-sidebar">
                                    <i class="fas fa-fw fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table class="ps_department_data_table" style="text-align:left"></table>
        </div>
    </div>
`;
}



(()=>{
    let html = ejs.render(Department(), {});
    $('#ps_main_content_display').html(html);

    html = ejs.render(DepartmentForm(), {});
    $('#ps_department_page_form_display').html(html);


    //Add page ajax file(s)
    addPageScript('departmentAjax');
})();