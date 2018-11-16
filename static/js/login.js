$(Document).ready(function(){

    bg = $('#bg-container');
    imgcon = $('#img-container');
    btn = $('#btn');

    btn.click(function() {
        bg.addClass("hidden");
        imgcon.removeClass("hidden");
    });

    setTimeout(function () {
        $('#error-message').fadeOut('slow');
    }, 3000);

    // show password
    $("#pwdCheckbox").click(function(){
        var pwd = $("#pwd")
        if ('password' == pwd.attr('type')) {
            pwd.prop('type', 'text');
        } else {
            pwd.prop('type', 'password');
        }
    });
});
