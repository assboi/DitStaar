// Add scrollspy to <body>
$('body').scrollspy({ target: ".navbar", offset: 50 });
// Add smooth scrolling on all links inside the navbar
$("#myNavbar a").on('click', function (event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();
        // Store hash
        var hash = this.hash;
        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
            // -50 will account for the sticky header
            scrollTop: $(hash).offset().top-50
        }, 1000, function () {

            // Add hash (#) to URL when done scrolling (default click behavior)
            // window.location.hash = hash;
        });
    }
});




$(function(){
    var map1 = new google.maps.Map(document.getElementById("map1"),
        {
            center: { lat: 59.09578, lng: 7.212224 },
            zoom: 12,
            disableDefaultUI: true

        });
    var skrubbsbu = new google.maps.Marker(
        {
            position: { lat: 59.09578, lng: 7.212224 },
            map: map1
        }
    );

    var map2 = new google.maps.Map(document.getElementById("map2"),
        {
            center: { lat: 59.125798, lng: 6.992701 },
            zoom: 13,
            disableDefaultUI: true

        });
    var taumevatn = new google.maps.Marker(
        {
            position: { lat: 59.125798, lng: 6.992701 },
            map: map2
        }
    );

}); 


