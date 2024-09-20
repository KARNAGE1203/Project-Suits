
function Contact() {
    $('.ps_main_page_breadcrumb').html(`Contact IT Department`);
    $('.ps_main_page_breadcrumb_navigation').html(`Contact IT Department`);

    return `
        <div class="layout-px-spacing mb-5">
            <div class="row layout-top-spacing">
                <div class="col-md-12" id="ps_contact_page_form_display"></div>
            </div>
        </div>
    `;
}


function ContactForm() {
    return `
        <div class="card">
            <div class="card-body">
                <form action="" class="ps_contact_form">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label>Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control ps_contact_name" placeholder="Name" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label>Email <span class="text-danger">*</span></label>
                                <input type="email" class="form-control ps_contact_email" placeholder="example@mail.com" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label>User ID</label>
                                <input type="text" class="form-control ps_contact_userID" placeholder="User ID" disabled>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label>Department </label>
                                <input type="text" class="form-control ps_contact_department" placeholder="Department" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group mb-4">
                                <label>Issue </label>
                                <textarea name=""  placeholder="Issue" class="form-control ps_contact_issue" rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <button type="submit" class="btn btn-primary ps_contact_submit float-right">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}

(()=>{
    let html = ejs.render(Contact(), {});
    $('#ps_main_content_display').html(html);

    html = ejs.render(ContactForm(), {});
    $('#ps_contact_page_form_display').html(html);

    addPageScript('contactAjax');
})();