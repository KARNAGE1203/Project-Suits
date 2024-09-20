
function User() {
    $('.ps_main_page_breadcrumb').html(`Manage User`);
    $('.ps_main_page_breadcrumb_navigation').html(`Manage User`);

    return `
        <div class="layout-px-spacing mb-5">
            <div class="row layout-top-spacing">
                <div class="col-md-12" id="ps_user_page_form_display"></div>
            </div>
        </div>
    `;
}


function UserForm() {
    return `
        <div class="card">
            <div class="card-body">
                <form action="" class="ps_manage_user_form">
                    <input type="hidden" name="" class="ps_manage_user_hiddenid">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label>First Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control ps_user_firstName" placeholder="First Name" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label>Last Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control ps_user_lastName" placeholder="Last Name" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group mb-4">
                                <label>Email</label>
                                <input type="email" class="form-control ps_user_email" placeholder="example@mail.com" >
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group mb-4">
                                <label>Phone</label>
                                <input type="text" class="form-control ps_user_phone" placeholder="Phone" >
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group mb-4">
                                <label >Role  <span class="text-danger">*</span></label>
                                <select class="form-control basic ps_user_role_dropdown " required></select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group mb-4">
                                <label>Address</label>
                                <textarea name="" id="" rows="2" cols="2" class="form-control ps_user_address"  placeholder="Address"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group mb-4">
                                <label>Username <span class="text-danger">*</span></label>
                                <input type="text" class="form-control ps_user_username" placeholder="Username" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group mb-4">
                                <label>Password <span class="text-danger">*</span></label>
                                <input type="password" class="form-control ps_user_password" placeholder="Password" required>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="form-group mb-4">
                                <label>Confirm Password </label>
                                <input type="password" class="form-control ps_user_confirm_password" placeholder="Confirm Password" >
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <button type="submit" class="btn btn-primary ps_manage_user_submit_btn float-right">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="card component-card_1 mb-5 mt-3">
            <div class="card-body ps_user_data_table_div">
                <div class="row mb-4">
                    <div class="col-md-12">
                        <label for="">Search By Username</label>
                        <div class="form-inline">
                            <div class="input-group" >
                                <input class="form-control form-control-sidebar ps_user_general_search"  placeholder="Search"  id ="ps_user_general_search">
                                <div class="input-group-append">
                                    <button class="btn btn-sidebar">
                                        <i class="fas fa-fw fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="ps_user_data_table" style="text-align:left"></table>
            </div>
    `;
}

function assignDepartmentModal() {
    return `
        <button type="button" class="ps_user_assign_department_modal_btn hide" data-toggle="modal" data-target="#assignDepartmentModal"></button>
        <div class="modal fade" id="assignDepartmentModal" tabindex="-1" role="dialog" aria-labelledby="assignDepartmentModal" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary">
                        <h5 class="modal-title text-white" id="exampleModalLabel">Assign User to Department</h5>
                    </div>
                    <div class="modal-body">
                        <form class="ps_user_assign_department_form" action="">
                            <input type="hidden" class="ps_user_assign_department_hiddenid">
                            <div class="row">
                                <div class="col-md-12 mt-2">
                                    <label for="">Department <span class="text-danger">*</span></label>
                                    <select class="form-control ps_user_assign_department_dropdown">
                                        <option value="" selected> Select Department </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mt-3 text-right">
                                    <button class="btn mr-2" data-dismiss="modal"><i class="flaticon-cancel-12"></i> Discard</button>
                                    <button class="btn bg-primary ps_user_assign_department_submit_btn" type="submit"> Submit</button>
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
    let html = ejs.render(User(), {});
    $('#ps_main_content_display').html(html);

    html = ejs.render(UserForm(), {});
    $('#ps_user_page_form_display').html(html);

    html = ejs.render(assignDepartmentModal(), {});
    $('#ps_main_content_display').append(html);

    addPageScript('userAjax');
})();