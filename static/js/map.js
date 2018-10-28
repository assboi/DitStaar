var map;
var poly; // the line
var markers = []; // Need markers?
var path;

$(function () {
    initMap();
    deletebtn = $('#slett');
    searchbtn = $("#go");
    save = $("#savebtn");
    list = $('#turListe');

    deletebtn.on("click", function () {
        clearMarkers();
        removePoly();
        // have to initialise poly after removing
        initPoly();
        // sette distanse aktivt til 0.00km
        $('#distance').val("0.00 km")
    });

    $.ajax({
        url: "/adventure",
        type: "GET",
        dataType: 'json',
        success: function (adventures) {
            $.each(adventures, function(i, adventure) {
                list.append('<button type="button" class="list-group-item list-group-item-action">'
                            + adventure.name + ', ' + adventure.distance + '</button>');
            });
        },
        error: function (error) {
            alert("error saving to database")
            console.log(error)
        }
    });

    save.on("click", function() {
        var adventure = {
            "name": $("#nameInput").val(),
            "distance": $('#distance').val()
        };
        $.ajax({
            url: "/adventure",
            data: adventure,
            type: "POST",
            dataType: 'json',
            success: function(data) {
                list.append('<button type="button" class="list-group-item list-group-item-action">'
                            + data.name +', '+ data.distance +'</button>');
            },
            error: function(error) {
                alert("error saving to database")
                console.log(error)
            }
        });
    });



    map.addListener("click", function(){
        $('#distance').val("" + getdistance() + " km");
    })

    var geocoder = new google.maps.Geocoder();
    searchbtn.on('click', function () {
        geocodeAddress(geocoder, map);
    });
});

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"),
        {
            center: { lat: 59.09578, lng: 7.212224 },
            zoom: 10,

        });
    initPoly();
}

function initPoly() {
    if (!poly) {
        poly = new google.maps.Polyline({
            strokeColor: "#000",
            strokeOpacity: 1.0,
            strokeWeight: 3,
        });
        poly.setMap(map)
    }
    map.addListener('click', addLatLng);
}

function removePoly() {
    poly.setMap(null)
    poly = null;
}

function getdistance() {
    // get the length of the poly lin in meters
    // convert to km and return
    var distance = google.maps.geometry.spherical.computeLength(poly.getPath());
    return roundToTwo(distance/1000)
}

function geocodeAddress(geocoder, map) {
    var address = document.getElementById('address').value;
    if (address == "") {
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

function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


function addLatLng(event) {
    path = poly.getPath();

    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    path.push(event.latLng);
    addMarker(event.latLng);
}



