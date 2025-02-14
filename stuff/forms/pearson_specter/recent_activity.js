function Report() {
    $('.ps_main_page_breadcrumb').html(`Recent Activity Report`);
    $('.ps_main_page_breadcrumb_navigation').html(`Recent Activity Report`);
    
    return `
    <div class="layout-px-spacing mb-5">
        <div class="row layout-top-spacing">
            <div class="col-md-12" id="ps_recent_activity_report_page_form_display"></div>
        </div>
    </div>
    `;
    }
    
    
    function RecentActivityReportForm() {
        return `
            <div class="card">
                <div class="card-body">
                    <form action="" class="ps_recent_activity_report_form">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label>Name <span class="text-danger">*</span></label>
                                    <select class="form-control select_search ps_recent_activity_report_user"></select>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-6">
                                <div class="form-group">
                                    <label>Pick Date in Range </label>
                                    <div class="form-control ps_recent_activity_report_date_range">
                                        <i class="icon-calendar2"></i>&nbsp;
                                        <span></span> <i class="icon-caret-down"></i>
                                        <input class="ps_recent_activity_report_date" type="hidden">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <button type="submit" class="btn btn-primary ps_recent_activity_report_submit float-right"><i class="icon-stats-dots mr-2"></i> Run Report</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12 mt-4 ps_recent_activity_report_display_page"></div>
            </div>
        
        `;
    }

    function RecentActivityReportPage(data) {
        let logo = `<img src="assets/img/logo.png" style="max-width: 100%; height: auto;"/>`
    
        let htmlTable = `
        <table class="table table-striped" width="100%">
            <thead>
                <tr class="bg-primary">
                    <th style="font-size:12px;" class="text-white">User ID</th>
                    <th style="font-size:12px;" class="text-white">Activity</th>
                    <th style="font-size:12px;" class="text-white">Date</th>
                </tr>
            </thead>
            <tbody>
    `;
    
        if (data.data.length > 0) {
            for (let i = 0; i < data.data.length; i++) {
                const item = data.data[i];
                htmlTable += `
                    <tr> 
                        <td> ${item.userID}</td>
                        <td> ${item.activity.toUcwords()}</td>
                        <td> ${item.DateTime.fullDate()}</td>
                    </tr>
                `;
            }
        } else {
            htmlTable += `<tr> <td colspan="3"> No data found. </td></tr>`;
        }
        htmlTable += `
                </tbody>
            </table>
        `;
    
        return `
            <div class="card">
                <div class="card-body mb-3" id="ps_report_print_div">
                    <div class="row ">
                        <div class="col-sm-12 col-md-6"><h4 style="font-size: 32px; font-weight: 700; color: #0e1726;">RECENT ACTIVITY REPORT</h4></div>
                        <div class="col-sm-12 col-md-6 align-self-right text-right text-sm-right">
                            <div class="company-info float-right">
                                <div class="" style="width: 100px;">
                                    ${logo}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <p class="d-block text-primary" style="font-size: 14px;font-weight: 600;">REPORT DETAILS</p>
                            <p class="d-block text-muted" style="font-size: 15px;"><b>From:</b> ${data.dateRange[0].fullDate()}</p>
                            <p class="d-block text-muted" style="font-size: 15px;"><b>To:</b> ${data.dateRange[1].fullDate()}</p>
                        </div>
                        <div class="col-md-6">
                            <div class="mt-3 text-right">
                                <p class="d-block text-primary" style="font-size: 14px;font-weight: 600;"> Pearson Specter </p>
                                <p class="d-block text-muted" style="font-size: 15px;"> email@pearsonspector.com</p>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-md-12 table-responsive">
                            ${htmlTable}
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-md-12 text-right">
                            <button type="button" class="btn ps-bg-primary-opacity ps-primary mr-2 ps_report_close_btn"><i class="icon-close2"></i> Close </button>
                            <button type="button" class="btn ps-bg-primary mr-2" onclick="printContent('ps_report_print_div', '');"><i class="icon-printer"></i> Print</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function RecentActivityReportPageUser(data) {
        let logo = `<img src="assets/img/logo.png" style="max-width: 100%; height: auto;"/>`
    
        let htmlTable = `
        <table class="table table-striped" width="100%">
            <thead>
                <tr class="bg-primary">
                    <th style="font-size:12px;" class="text-white">User ID</th>
                    <th style="font-size:12px;" class="text-white">Activity</th>
                    <th style="font-size:12px;" class="text-white">Date</th>
                </tr>
            </thead>
            <tbody>
    `;
    
        if (data.data.length > 0) {
            for (let i = 0; i < data.data.length; i++) {
                const item = data.data[i];
                htmlTable += `
                    <tr> 
                        <td> ${item.userID}</td>
                        <td> ${item.activity.toUcwords()}</td>
                        <td> ${item.DateTime.fullDate()}</td>
                    </tr>
                `;
            }
        } else {
            htmlTable += `<tr> <td colspan="3"> No data found. </td></tr>`;
        }
        htmlTable += `
                </tbody>
            </table>
        `;
    
        return `
            <div class="card">
                <div class="card-body mb-3" id="ps_report_print_div">
                    <div class="row ">
                        <div class="col-sm-12 col-md-6"><h4 style="font-size: 32px; font-weight: 700; color: #0e1726;">RECENT ACTIVITY REPORT</h4></div>
                        <div class="col-sm-12 col-md-6 align-self-right text-right text-sm-right">
                            <div class="company-info float-right">
                                <div class="" style="width: 100px;">
                                    ${logo}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <p class="d-block text-primary" style="font-size: 14px;font-weight: 600;">REPORT DETAILS</p>
                            <p class="d-block text-muted" style="font-size: 15px;"><b>User:</b> ${data.user}</p>
                            <p class="d-block text-muted" style="font-size: 15px;"><b>From:</b> ${data.dateRange[0].fullDate()}</p>
                            <p class="d-block text-muted" style="font-size: 15px;"><b>To:</b> ${data.dateRange[1].fullDate()}</p>
                        </div>
                        <div class="col-md-6">
                            <div class="mt-3 text-right">
                                <p class="d-block text-primary" style="font-size: 14px;font-weight: 600;"> Pearson Specter </p>
                                <p class="d-block text-muted" style="font-size: 15px;"> email@pearsonspector.com</p>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4">
                        <div class="col-md-12 table-responsive">
                            ${htmlTable}
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-md-12 text-right">
                            <button type="button" class="btn ps-bg-primary-opacity ps-primary mr-2 ps_report_close_btn"><i class="icon-close2"></i> Close </button>
                            <button type="button" class="btn ps-bg-primary mr-2" onclick="printContent('ps_report_print_div', '');"><i class="icon-printer"></i> Print</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    (()=>{
    let html = ejs.render(Report(), {});
    $('#ps_main_content_display').html(html);
    
    html = ejs.render(RecentActivityReportForm(), {});
    $('#ps_recent_activity_report_page_form_display').html(html);
    
    addPageScript('recentActivityAjax');
    })();