var map;
var poly; // the line
var markers = [];
var path;
var storage = [];
var coord = [];

$(function () {
    initMap();
    fetchData()

    // TODO RYDD OPP I KODE!!
    // Noe som ikke stemmer når markes blir lagt inn igjen

    $("#turListe").on("click", ".list-group-item", function () {
        // get the id from the table
        var id = $(this).text().split(".")[0]; 
        var temp = coord[id].replace(/\(/g, "").replace(/\)/g, " ").replace(/,/g, "");
        temp = temp.split(" ");
        for (i=0 ; i < temp.length ; i+=2 ) {
            var latlng = new google.maps.LatLng(temp[i], temp[i+1]);
            addMarker(latlng);
            // how do i draw the polyline??
        }
    });

    var page = 1,
        pagelimit = 5,
        totalrecords = 1;

    $("#prev").on("click", function() {
        if (page > 1){
            page--;
            $('#turListe').empty();
            fetchData()
        }
    
    });

    $("#next").on("click", function() {
        if (page * pagelimit < totalrecords){
            page++;
            $('#turListe').empty();
            fetchData()
        }
    });

    $('#slett').on("click", function () {
        clearMarkers();
        removePoly();
        // have to initialise poly after removing
        initPoly();
        // sette distanse aktivt til 0.00km
        $('#distance').val("0.00 km");
    });

    $("#savebtn").on("click", function(){
        saveData();
    });
    $("#nameInput").keypress(function(e){
        if (e.which == 13) {
            saveData();
        }
    });

function fetchData() {
    $.ajax({
        url: "/adventure",
        type: "GET",
        dataType: 'json',
        success: function(trips) {
            trips.forEach(function(trip) {
                coord.push(trip.route)
                totalrecords = trip.totalrecords;
                if (trip.page === page){
                    $('#turListe').append('<button type="button" class="list-group-item list-group-item-action">'
                    + trip.aid + ". " + trip.name + ' - ' + trip.distance +'</button>');
                }
            });
        },
        error: function (error) {
            alert("error saving to database")
            console.log(error)
        }
    });
}

function saveData(){
    route = "";
    for (i = 0; i < markers.length; i++) {
           route += markers[i].getPosition();
    }
    // data to send to save in database
    var adventure = {
        "name": $("#nameInput").val(),
        "distance": $('#distance').val(),
        "route": route
    };

    $.ajax({
        url: "/adventure",
        data: adventure,
        type: "POST",
        dataType: 'json',
        success: function (trip) {
            if (trip.page === page) {
                totalrecords = trip.totalrecords;
                $('#turListe').append('<button type="button" class="list-group-item list-group-item-action">'
                    + trip.name + ' - ' + trip.distance + '</button>');
            }
        },
        error: function (error) {
            alert("error saving to database")
            console.log(error)
        }
    });
    // nullstill felter
    $("#nameInput").val("Navn på tur")
}

    map.addListener("click", function(){
        $('#distance').val("" + getdistance() + " km");
    })

    var geocoder = new google.maps.Geocoder();

    $("#address").keypress(function(e) {
        if (e.which == 13) {
            geocodeAddress(geocoder, map);
        }
    });

    $("#go").on('click', function () {
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
            console.log(results[0])
            map.setCenter(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function addMarker(latlng) {
    var marker = new google.maps.Marker({
        position: latlng,
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



