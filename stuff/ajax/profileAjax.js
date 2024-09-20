
$(document).ready(function () {

    let userData = JSON.parse($('.hidden_userdata').val());
    $('.ps_profile_first_name').val(userData.firstName);
    $('.ps_profile_last_name').val(userData.lastName);
    $('.ps_profile_phon').val(userData.phone);
    $('.ps_profile_email').val(userData.email);
    $('.ps_profile_address').val(userData.address);
    $('.ps_profile_hiddenid').val(userData.userID);
    
    
    // Form Submit for user form
    $(document).on('submit', 'form.ps_profile_form', function (e) {
        e.preventDefault();

        //Get form data from html
        let ps_profile_hiddenid = $('.ps_profile_hiddenid', this).val();
        let ps_profile_first_name = $('.ps_profile_first_name', this).val(); 
        let ps_profile_last_name = $('.ps_profile_last_name', this).val();
        let ps_profile_phon = $('.ps_profile_phon', this).val();
        let ps_profile_email = $('.ps_profile_email', this).val();
        let ps_profile_address = $('.ps_profile_address', this).val();
        let ps_profile_password = $('.ps_profile_password', this).val();
        let ps_profile_confirm_password = $('.ps_profile_confirm_password', this).val();
        

        //Setting submit button to loader
        $('.ps_profile_submit').html('<div class="mr-2 spinner-border align-self-center loader-sm"></div>');
        //Diable submit button
        $('.ps_profile_submit').attr('disabled', 'disabled');
        
        socket.off('specific'); 
        socket.off(melody.melody1+'_specific'); 

        setTimeout(function () {
            socket.emit('specific', {
                "melody1": melody.melody1,
                "melody2": melody.melody2,
                "param": 'updateProfile',
                "ps_profile_hiddenid": ps_profile_hiddenid,
                "ps_profile_first_name": ps_profile_first_name,
                "ps_profile_last_name": ps_profile_last_name,
                "ps_profile_phon": ps_profile_phon,
                "ps_profile_email": ps_profile_email,
                "ps_profile_address" : ps_profile_address,
                "ps_profile_password": ps_profile_password,
                "ps_profile_confirm_password": ps_profile_confirm_password
            });
        }, 500);

        //Get response from submit
        socket.on(melody.melody1 + '_updateProfile', function (data) {
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
                $('.ps_profile_form').trigger('reset');
                socket.off(melody.melody1+'_updateProfile'); 
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
            $('.ps_profile_submit').html('Submit');
            //Enable submit button
            $('.ps_profile_submit').removeAttr('disabled');
        });

    });

});

