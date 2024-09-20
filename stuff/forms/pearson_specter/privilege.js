
function Privilege() {
    $('.ps_main_page_breadcrumb').html(`Manage Privilege`);
    $('.ps_main_page_breadcrumb_navigation').html(`Manage Privilege`);

    return `
        <div class="layout-px-spacing mb-5">
            <div class="row layout-top-spacing">
                <div class="col-md-12" id="ps_privilege_page_form_display"></div>
            </div>
        </div>
    `;
}


function PrivilegeForm(data) {
    let htmlData = '';
    if (data) {
        for (const app in data) {
            if (data.hasOwnProperty(app)) {
                const main = data[app];
                htmlData += displayPrivilege(main);
            }
        }
    } else {
        htmlData = '';
    }
    return `
        <div class="card component-card_1 mb-5 ps_privilege_navigation ps_privilege_main_form mt-3">   
            <div class="card-body">
                <div class="ps_privilege_div">
                    <form class="ps_manage_privilege_form">
                        <p class="text-danger">Select the user you want to change privileges for</p>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label >User </label>
                                    <select class="form-control basic ps_privilege_user ps_assign_privilege_user">
                                        <!-- <option selected="selected">Select User</option> -->
                                    </select>
                                </div>
                            </div>
                        </div>
                        ${htmlData}
                    </form>
                </div>
            </div>
        </div>
    `;
}

function displayPrivilege(main) {
    let formHtml = '';
    if (main != undefined && main.tableTitle != undefined) {
        let checkboxes = '';
        for (let i = 0; i < main.columnList.length; i++) {
            const item = main.columnList[i];
            if (item == main.allCheckBox || item == main.funcName) {} else {
                let title = item.toString().replace(/_/g, ' ');
                checkboxes += `
                    <div class="col-md-3 mb-2">
                        <p class="m-0 p-1"> ${title.toUpperCase()} </p>
                        <label class="switch s-dark"> <input type="checkbox" id="${item}" class="${item} checkBox group_${main.allCheckBox}" name="${item}" value="yes" data-column="${item}" data-all="no" data-category="${main.funcName}" data-table="${main.tableName}"> <span class="slider round"></span> </label>
                    </div>
                `;
            }
        }
        formHtml = `
            <fieldset class="mt-4 mb-3">
                <legend class="font-weight-semibold  font-size-sm m-0 p-0"> 
                    ${main.icon}
                    <span class="text-uppercase" style="font-size:0.6em;"> ${main.tableTitle.toUpperCase()} </span>
                    <a href="#" class="float-right text-default collapsed" data-toggle="collapse" data-target="#all_${main.tableName}" aria-expanded="false">
                        <i class="icon-circle-down2"></i>
                    </a>
                    <div class="custom-control custom-switch float-right mr-3 mt-2">
                        <input type="checkbox" class="custom-control-input checkBoxAll ${main.allCheckBox}" name="${main.allCheckBox}" value="yes" data-column="${main.allCheckBox}" data-table="${main.tableName}" id="${main.allCheckBox}">
                        <label class="custom-control-label" for="${main.allCheckBox}" style="font-size:0.7em!important">ALL</label>
                    </div>
                </legend>
                <hr class="m-0 p-0">  
                <div class="collapse " id="all_${main.tableName}" >
                    <div class="row mt-3">
                        ${checkboxes}
                    </div>
                </div>
            </fieldset>
        `;
    } else {
        formHtml = ``;
    }

    return formHtml;
}

function appPrivileges() {
    socket.off(melody.melody1+'_get_app_privileges');
    socket.emit('privilege', {
        melody1: melody.melody1,
        melody2: melody.melody2,
        param: 'get_app_privileges'
    });

    socket.on(melody.melody1+'_get_app_privileges', (data) => {
        html = ejs.render(PrivilegeForm(data), {});
        $('#ps_privilege_page_form_display').html(html);

        //Add page ajax file(s)
        addPageScript('privilegeAjax');
    });
}

(() => {
    let html = ejs.render(Privilege(), {});
    $('#ps_main_content_display').html(html);

    //Fetch for App privileges
    appPrivileges();
})();