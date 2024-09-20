$(document).ready(function () {

    let userData = JSON.parse($('.hidden_userdata').val());

    let department = JSON.parse($('.hidden_department_data').val());

    // UserID in text Box
    $('.ps_contact_userID').val(userData.userID);
    $('.ps_contact_department').val(department.toUcwords());


     // Form Submit
    $(document).on('submit', 'form.ps_contact_form', function (e) {
        e.preventDefault();

        //Get form data from html
        let ps_contact_name = $('.ps_contact_name', this).val();
        let ps_contact_email = $('.ps_contact_email', this).val();
        let ps_contact_userID = $('.ps_contact_userID', this).val();
        let ps_contact_department = $('.ps_contact_department', this).val();
        let ps_contact_issue = $('.ps_contact_issue', this).val();
    

        //Setting submit button to loader
        $('.ps_contact_submit').html('<div class="mr-2 spinner-border align-self-center loader-sm"></div>');
        //Diable submit button
        $('.ps_contact_submit').attr('disabled', 'disabled');
        
        socket.off('insertNewContact');
        socket.off(melody.melody1+'_insertNewContact'); 

        setTimeout(function () {
            socket.emit('insertNewContact', {
                "melody1": melody.melody1,
                "melody2": melody.melody2,
                "ps_contact_name": ps_contact_name,
                "ps_contact_email": ps_contact_email,
                "ps_contact_userID": ps_contact_userID,
                "ps_contact_department": ps_contact_department,
                "ps_contact_issue": ps_contact_issue,
            });
        }, 500);

        //Get response from submit
        socket.on(melody.melody1 + '_insertNewContact', function (data) {
            //Get json content from login code
            if (data.type == "success") {
                //trigger alert using the alert function down there
                Toast.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    padding: '1em'
                })

                //Empty the form 
                $('.ps_contact_form').trigger('reset');
                $('.ps_contact_userID').val(userData.userID);
                $('.ps_contact_department').val(department.toUcwords());

                socket.off(melody.melody1+'_insertNewContact'); 
                
            } else if (data.type == "caution") {
                Toast.fire({
                    text: data.message,
                    type: 'warning',
                    padding: '1em'
                })
            } else {
                //trigger alert using the alert function down there
                Toast.fire({
                    title: 'Error',
                    text: data.message,
                    type: 'error',
                    padding: '1em'
                })
            }
            //Set submit button back to its original text
            $('.ps_contact_submit').html('Submit');
            //Enable submit button
            $('.ps_contact_submit').removeAttr('disabled');
        });

    });



    //================================================================================//

});