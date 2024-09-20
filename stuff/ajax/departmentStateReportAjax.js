$(document).ready(function () {

    startDateRangePicker('.ps_department_state_report_date_range', '.ps_department_state_report_date');

    //Close opened report
    $(document).on('click.otherclicks', 'button.ps_report_close_btn', function(e){
        e.preventDefault();
        $('.ps_department_state_report_display_page').html(``);
        $('.ps_department_state_report_form').trigger('reset');
    });

    // Submit
    $(document).on('submit', 'form.ps_department_state_report_form', function (e) {
        e.preventDefault();

        //Get form data from html
        let date_range = $('.ps_department_state_report_date', this).val();

        //Setting submit button to loader
        $('.ps_department_state_report_submit').html('<div class="mr-2 spinner-border align-self-center loader-sm"></div>');
        //Diable submit button
        $('.ps_department_state_report_submit').attr('disabled', 'disabled');
        
        socket.off('runPSReport');
        socket.off(melody.melody1+'_document_state_report');

        setTimeout(function () {
            socket.emit('runPSReport', {
                "melody1": melody.melody1,
                "melody2": melody.melody2,
                "param": 'document_state_report',
                "date_range": date_range
            });
        }, 500);

        //Get response from submit
        socket.on(melody.melody1 + '_document_state_report', function (data) {
            if (data.type == "error") {
                Toast.fire({
                    text: data.message,
                    type: 'error',
                    padding: '1em'
                })
            } else if(data.type == "caution") {
                Toast.fire({
                    text: data.message,
                    type: 'warning',
                    padding: '1em'
                })
            } else { 
                let html;
                html = DepartmentStateReportPage({
                    data: data.data, 
                    dateRange: date_range.split("**")
                });
                $('.ps_department_state_report_display_page').html(html);

                // reset form
                $('.ps_department_state_report_form').trigger('reset');

                socket.off(melody.melody1+'_document_state_report');
            }
            //Set submit button back to its original text
            $('.ps_department_state_report_submit').html('<i class="icon-stats-dots mr-2"></i> Run Report');
            //Enable submit button
            $('.ps_department_state_report_submit').removeAttr('disabled');
        });
    });


});

