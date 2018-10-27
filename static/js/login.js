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


});