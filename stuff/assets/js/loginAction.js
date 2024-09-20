$(document).ready(function () {
    
    const socket = io();
    // Toast Function
    var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        heightAuto:true
    });

    //Submit form
    $('.ps_loginForm').submit(function (e) {
        e.preventDefault();
        //Get data from html
        let userID = $('.ps_userID', this).val();
        let password = $('.ps_password', this).val();

        $('.ps_loginBtn').attr('disabled');

        setTimeout(()=>{
            socket.emit('system_login', {
                "username": userID,
                "password": password
            });
        }, 500);

        //Get login response
        socket.on('_system_login', (data)=>{
            //Get json content from login code
            if (data.type == "success") {
                //trigger alert using the alert function down there
                Toast.fire({
                    title: 'Success',
                    text: data.message,
                    icon: 'success',
                    padding: '1em'
                })
                //Now load to dashboard page
                const melody = {
                    melody1: data.melody1,
                    melody2: data.melody2,
                }
                window.localStorage.setItem('melody', JSON.stringify(melody));
                //Now load to dashboard page
                const queryString = window.location.search;
                window.location.replace("/dashboard" + ((queryString.pub && queryString.med) ? queryString : "?pub="+melody.melody2+"&med="+melody.melody1) + "&evn=dash");
            } else if (data.type == "caution") {
                Toast.fire({
                    text: data.message,
                    icon: 'warning',
                    padding: '1em'
                })
            } else {
                Toast.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                    padding: '1em'
                })
            }
            //Set submit button back to its original text
            // clear form data
            $('.ps_loginForm').trigger('reset');
        });
    });
});
