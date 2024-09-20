
function Profile() {
    $('.ps_main_page_breadcrumb').html(`Manage Profile`);
    $('.ps_main_page_breadcrumb_navigation').html(`Manage Profile`);

    return `
        <div class="layout-px-spacing mb-5">
            <div class="row layout-top-spacing">
                <div class="col-md-12" id="ps_profile_page_form_display"></div>
            </div>
        </div>
    `;
}

function ProfileForm() {
    return `
    <div class="container mt-5">
        <div class="card">
            <div class="card-body">
                <!-- Personal Information -->
                <h5>Personal Information</h5>
                <form action="" class="ps_profile_form">
                    <div class="row mt-2">
                        <div class="form-group col-md-6">
                            <label>First Name <span class="text-danger">*</span></label>
                            <input type="hidden" class="form-control ps_profile_hiddenid">
                            <input type="text" class="form-control ps_profile_first_name" placeholder="First Name" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label>Last Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control ps_profile_last_name" placeholder="Last Name" required>
                        </div>
                    </div>
                    <div class="row ">
                        <div class="form-group col-md-6 mt-2">
                            <label>Phone </label>
                            <input type="tel" class="form-control ps_profile_phon" placeholder="Phone" required>
                        </div>
                        <div class="form-group col-md-6 mt-2">
                            <label>Email Address</label>
                            <input type="email" class="form-control ps_profile_email" placeholder="example@mail.com">
                        </div>
                    </div>
                    <div class="row ">
                        <div class="form-group col-md-12 mt-2">
                            <label>Address</label>
                            <textarea name=""  placeholder="Address" class="form-control ps_profile_address" rows="2"></textarea>
                        </div>
                    </div>
                    <div class="row ">
                        <div class="form-group col-md-6 mt-2">
                            <label>New Password <span class="text-danger">*</span></label>
                            <input type="password" class="form-control ps_profile_password" placeholder="New Password" required>
                        </div>
                        <div class="form-group col-md-6 mt-2">
                            <label>Confirm Password <span class="text-danger">*</span></label>
                            <input type="password" class="form-control ps_profile_confirm_password" placeholder="Confirm Password" required>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-12 text-right">
                            <button type="submit" class="btn btn-primary ps_profile_submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    `;
}

(()=>{
    let html = ejs.render(Profile(), {});
    $('#ps_main_content_display').html(html);

    html = ejs.render(ProfileForm(), {});
    $('#ps_profile_page_form_display').html(html);

    addPageScript('profileAjax');
})();