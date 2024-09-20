(()=>{

    // Include  socket connection
    const socket = io();

    //Logout event
    $('a.ps_logout_btn').click(function(e) {
        e.preventDefault();

        $(this).html('<div class="spinner-border text-white mr-2 align-self-center loader-sm"></div>');

        setTimeout(function(){
            socket.emit('logoutAction', {
                "melody1": melody.melody1,
                "melody2": melody.melody2
            });
        }, 500);
    });

    //Get logout response
    socket.on(melody.melody1+'_logoutAction', function(data) {
        if (data.type == "error") {
            $('.ps_logout_btn').html(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="feather feather-log-out">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line></svg> 
                <span>Log Out</span>
            `);
        } else {
            $('.ps_logout_btn').html(data.message);
            window.localStorage.clear();
            window.location.replace("/");
        }
        
    });
})();

