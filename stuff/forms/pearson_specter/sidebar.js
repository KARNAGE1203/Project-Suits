
function Sidebar() {
    return `
        <!-- Main Sidebar Container -->
        <aside class="main-sidebar ps_sidebar_bg elevation-4">
            <!-- Brand Logo -->
            <a href="Home.html" class="brand-link text-center">
                <img src="assets/img/PSwhite.png" alt="Logo" style="width: 6.3rem !important" />
            </a>

            <div class="sidebar">
                <!-- Sidebar Menu -->
                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li class="nav-item">
                            <a href="/dashboard" class="nav-link  ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="dashboard"
                                data-scripts="single::/dashboardAjax">
                                <i class="nav-icon fas fa-tachometer-alt"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>

                        <% if (privilege.pearson_specter.add_document == "yes" ||  privilege.pearson_specter.edit_document == "yes" || privilege.pearson_specter.deactivate_document == "yes") { %>
                            <li class="nav-item">
                                <a href="/document" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                    data-scripts="single::/documentAjax">
                                    <i class="nav-icon fas fa-folder"></i>
                                    <p>Manage Documents</p>
                                </a>
                            </li>
                        <% } %>

                        <% if (privilege.pearson_specter.add_department == "yes" ||  privilege.pearson_specter.edit_department  == "yes" || privilege.pearson_specter.deactivate_department == "yes") { %>
                            <li class="nav-item">
                                <a href="/department" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                    data-scripts="single::/departmentAjax">
                                    <i class="nav-icon fas fa-chart-bar"></i>
                                    <p>Manage Department</p>
                                </a>
                            </li>
                        <% } %>

                        <% if (privilege.pearson_specter.add_privilege == "yes" ||  privilege.pearson_specter.edit_privilege == "yes" || privilege.pearson_specter.deactivate_privilege == "yes") { %>
                            <li class="nav-item">
                                <a href="/privilege" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                    data-scripts="single::/privilegeAjax">
                                    <i class="nav-icon fas fa-user-alt"></i>
                                    <p>Manage Privileges</p>
                                </a>
                            </li>
                        <% } %>

                        <% if (privilege.pearson_specter.add_user == "yes" ||  privilege.pearson_specter.edit_user == "yes" || privilege.pearson_specter.deactivate_user == "yes") { %>
                            <li class="nav-item">
                                <a href="/user" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                    data-scripts="single::/userAjax">
                                    <i class="nav-icon fas fa-users"></i>
                                    <p>Manage User</p>
                                </a>
                            </li>
                        <% } %>

                        <% if (privilege.pearson_specter.add_role == "yes" ||  privilege.pearson_specter.edit_role == "yes" || privilege.pearson_specter.deactivate_role == "yes") { %>
                            <li class="nav-item">
                                <a href="/role" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                    data-scripts="single::/roleAjax">
                                    <i class="nav-icon fas fa-user-alt"></i>
                                    <p>Manage Role</p>
                                </a>
                            </li>
                        <% } %>

                        <li class="nav-item">
                            <a href="/contact" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                data-scripts="single::/contactAjax
                            ">
                                <i class="nav-icon fas fa-laptop"></i>
                                <p>Contact IT Department</p>
                            </a>
                        </li>
                        <% if (privilege.pearson_specter.document_upload_report == "yes" || privilege.pearson_specter.department_state_report == "yes" || privilege.pearson_specter.login_report == "yes"|| privilege.pearson_specter.deactivation_report == "yes"|| privilege.pearson_specter.recent_activity_report == "yes") { %>
                            <li class="nav-item">
                                <a href="#" class="nav-link ">
                                    <i class="nav-icon fas fa-chart-area"></i>
                                    <p>
                                        Reports
                                        <i class="fas fa-angle-left right"></i>
                                    </p>
                                </a>
                                <ul class="nav nav-treeview">
                                    <% if (privilege.pearson_specter.document_upload_report == "yes") { %>
                                        <li class="nav-item">
                                            <a href="/upload_report" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                                data-scripts="single::/uploadReportAjax"> 
                                                <i class="far fa-circle nav-icon"></i>
                                                <p>Document Upload </p>
                                            </a>
                                        </li>
                                    <% } %>
                                    <% if (privilege.pearson_specter.department_state_report == "yes") { %>
                                        <li class="nav-item">
                                            <a href="/department_state_report" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                                data-scripts="single::/departmentStateReportAjax"> 
                                                <i class="far fa-circle nav-icon"></i>
                                                <p>Department State</p>
                                            </a>
                                        </li>
                                    <% } %>

                                    <% if (privilege.pearson_specter.login_report == "yes") { %>
                                        <li class="nav-item">
                                            <a href="/login_report" class="nav-link ps_main_navigation_btn"  data-appname="pearson_specter" data-navparent="pearson_specter"
                                                data-scripts="single::/loginReportAjax"> 
                                                <i class="far fa-circle nav-icon"></i>
                                                <p>Login</p>
                                            </a>
                                        </li>
                                    <% } %>

                                    <% if (privilege.pearson_specter.deactivation_report == "yes") { %>
                                        <li class="nav-item">
                                            <a href="/deactivation_report" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                                data-scripts="single::/deactivationReportAjax"> 
                                                <i class="far fa-circle nav-icon"></i>
                                                <p>Deactivation</p>
                                            </a>
                                        </li>
                                    <% } %>

                                    <% if (privilege.pearson_specter.recent_activity_report == "yes") { %>
                                        <li class="nav-item">
                                            <a href="/recent_activity" class="nav-link ps_main_navigation_btn" data-appname="pearson_specter" data-navparent="pearson_specter"
                                                data-scripts="single::/recentActivityAjax"> 
                                                <i class="far fa-circle nav-icon"></i>
                                                <p>Recent Activity  </p>
                                            </a>
                                        </li>
                                    <% } %>
                                </ul>
                            </li>
                        <% } %>
                    </ul>
                </nav>
                <!-- /.sidebar-menu -->
            </div>

        </aside>
    `;
}