(()=>{
    //Navigation control buttons event
    //======================================================================================================================//
        //Navigations for main sidebar navs
        $(document).on('click.pagenavigation', 'a.ps_main_navigation_btn', function(e) {
            e.preventDefault();
            let thisElement = (this);
            let pageFileName = $(this).attr('href');
            let appname = $(this).data('appname');
            let pageScripts = $(this).data("scripts");
            let navparent = $(this).data("navparent");
            pageFileName = pageFileName.split("/")[1];

            ClearCssLinks();
            $('.flatpickr-calendar').remove();
            setTimeout(() => {
                mainPagination(pageFileName, appname, pageScripts, navparent);
            }, 100);
        });

        //Clear added css links
        function ClearCssLinks() {
            document.getElementById('ps_external_stylesheet').href = '';
            document.getElementById('ps_external_stylesheet1').href = '';
            document.getElementById('ps_external_stylesheet2').href = '';
            document.getElementById('ps_external_stylesheet3').href = '';
            document.getElementById('ps_external_stylesheet4').href = '';
            document.getElementById('ps_external_stylesheet5').href = '';
            document.getElementById('ps_external_stylesheet6').href = '';
            document.getElementById('ps_external_stylesheet7').href = '';
            document.getElementById('ps_external_stylesheet8').href = '';
            document.getElementById('ps_external_stylesheet9').href = '';
        }
    //======================================================================================================================//


    //By default when page loads, we're opening a page based on the url's pagination. If there isn't any the dashboard loads
    //======================================================================================================================//
        //Getting current pagination data from browser's local storage
        let pagination = JSON.parse(window.localStorage.getItem('pagination'));
        
        //Checking if such data exist
        if (pagination) {
            //Pagination data exist, so we're opening the page
            openPage(pagination.pageFileName, pagination.appname);

            $('ul.nav-sidebar li.nav-item a.nav-link').removeAttr('data-active');
            $('li.ps_sidebar_nav_parent_'+pagination.navparent+' a.nav-link').attr('data-active', 'true');

    
            //Clearing the value to free memory
            pageScripts = '';

        } else {
            //Open dashboard if there is no data in current pagination
            openPage('dashboard', 'pearson_specter');

            //Clearing the values to free memory
            pagination = '';
        }
    //======================================================================================================================//
})();