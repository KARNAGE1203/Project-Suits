
function Dashboard() {
    // Change Breadcrumbs names
    $('.ps_main_page_breadcrumb').html(`Dashboard`);
    $('.ps_main_page_breadcrumb_navigation').html(`Dashboard`);

    return `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <div class="small-box bg-info">
                        <div class="inner">
                            <h3 class ="ps_document_count">0</h3>
                            <p>Documents</p>
                        </div>
                        <div class="icon">
                            <i class="ion ion-folder"></i>
                        </div>
                        <a href="/document" class="nav-link ps_main_navigation_btn small-box-footer" data-appname="pearson_specter" data-navparent="dashboard"
                        data-scripts="single::/documentAjax">More info <i class="fas fa-arrow-circle-right"></i></a>

                    </div>
                </div>
                <div class="col-md-4">
                    <div class="small-box bg-success">
                        <div class="inner">
                            <h3 class ="ps_department_count">0</h3>
                            <p>Departments</p>
                        </div>
                        <div class="icon">
                            <i class="ion ion-stats-bars"></i>
                        </div>
                        <a href="/department" class="nav-link ps_main_navigation_btn small-box-footer" data-appname="pearson_specter" data-navparent="dashboard"
                        data-scripts="single::/departmentAjax">More info <i class="fas fa-arrow-circle-right"></i></a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="small-box bg-danger">
                        <div class="inner">
                            <h3 class ="ps_user_count">0</h3>
                            <p>Users</p>
                        </div>
                        <div class="icon">
                            <i class="ion ion-person-add"></i>
                        </div>
                        <a href="/user" class="nav-link ps_main_navigation_btn small-box-footer" data-appname="pearson_specter" data-navparent="dashboard"
                        data-scripts="single::/userAjax ">More info <i class="fas fa-arrow-circle-right"></i></a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header p-2">
                            <h3>Recent Activity</h3>
                        </div>
                        <div class="card-body">
                            <div class="" id="timeline" style="height: 250px;overflow-y: auto;">
                                <div class="ps_dashboard_session_activity"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

}


(()=>{
    let html = ejs.render(Dashboard(), {});
    $('#ps_main_content_display').html(html);

    //Add page ajax file(s)
    addPageScript('dashboardAjax');
})();