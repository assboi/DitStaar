var poly;
var map;
var markers = [];

$(function(){

    gif = $('#mygif')
    btn = $('#mybtn')
    btn.click(function() {
        if (gif.hasClass("hide")) {
            btn.removeClass("btn-success").addClass("btn-danger")
            gif.removeClass("hide")

        }else {
            gif.addClass("hide")
            btn.removeClass("btn-danger").addClass("btn-success")
        }
    
    });
    
    map = new google.maps.Map(document.getElementById("map"),
        {
            center: { lat: 59.09578, lng: 7.212224 },
            zoom: 10,

        });

    poly = new google.maps.Polyline({
        strokeOpacity: 1.0,
        strokeWeight: 3
    });
    poly.setMap(map);
    map.addListener('click', addLatLng);
    
    var geocoder = new google.maps.Geocoder();

    document.getElementById('slett').addEventListener('click', function(){
        clearMarkers();
    });

    document.getElementById('go').addEventListener('click', function () {
        geocodeAddress(geocoder, map);
    });
});


function geocodeAddress(geocoder, map) {
    var address = document.getElementById('address').value;
    if (address == ""){
        address = "Sandnes"
    }
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function addLatLng(event) {
    path = poly.getPath();

    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    path.push(event.latLng);

    // Add a new marker at the new plotted point on the polyline.
    addMarker(event.latLng)
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}
