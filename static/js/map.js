var map;
var poly; // the line
var markers = [];
var path;
var storage = [];

$(function () {
    initMap();
    deletebtn = $('#slett');
    searchbtn = $("#go");
    save = $("#savebtn");
    list = $('#turListe');

    var page = 1,
        pagelimit = 5,
        totalrecords = 0;

    fetchData()

    $("#prev").on("click", function() {
        if (page > 1){
            page--;
            list.empty();
            fetchData()
        }
        // console.log("page="+page+" pagelimit="+ pagelimit+ " totalrecods="+ totalrecords)
    });

    $("#next").on("click", function() {
        if (page * pagelimit < totalrecords){
            page++;
            list.empty();
            fetchData()
        }
        // console.log("page=" + page + " pagelimit=" + pagelimit + " totalrecods=" + totalrecords)
    });

    deletebtn.on("click", function () {
        clearMarkers();
        removePoly();
        // have to initialise poly after removing
        initPoly();
        // sette distanse aktivt til 0.00km
        $('#distance').val("0.00 km");
    });    

function fetchData() {
    $.ajax({
        url: "/adventure",
        type: "GET",
        dataType: 'json',
        success: function(trips) {
            trips.forEach(function(trip) {
                totalrecords = trip.totalrecords;
                // console.log("page.trip:"+trip.page+" page:"+page)
                console.log(trip.name)
                if (trip.page === page){
                    console.log()
                    list.append('<button type="button" class="list-group-item list-group-item-action">'
                    + trip.name + ', ' + trip.distance + '</button>');
                }
            });
        },
        error: function (error) {
            alert("error saving to database")
            console.log(error)
        }
    });
}

    save.on("click", function() {
        // nullstill felter
        $('#distance').val("0.00 km");
        $("#nameInput").val("Navn på tur")
        // store polyline
        str = ""
        for (i=0; i<markers.length; i++) {
            var temp = markers[i].getPosition();
            str += temp + " : "
        }

        // Post request to save in database
        var adventure = {
            "name": $("#nameInput").val(),
            "distance": $('#distance').val(),
            "route": str
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
            console.log(results[0])
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



