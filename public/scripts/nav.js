let parkingSpot = {};

function setLocation(lat, lng){
    parkingSpot.lat = Number(lat);
    parkingSpot.lng = Number(lng);
    console.log("test");
    initMap(1);
}
    
// Initialize and add the map
function initMap(count) {
    if(count = 1){
        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();
        
        // map options
        let mapOptions = {
            zoom:12,
            center: new google.maps.LatLng(parkingSpot.lat, parkingSpot.lng)
        };
        
        // new map
        let map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        // place marker
        let marker = new google.maps.Marker({
            position: {lat:parkingSpot.lat, lng:parkingSpot.lng},
            map: map
        })
        
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directionsPanel'));
    }
}

let navBtn = document.getElementById('navBtn');

navBtn.addEventListener('click', function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getDirections);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
});

function getDirections(position) {
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();
    
    let mapOptions = {
        zoom:12,
        center: new google.maps.LatLng(parkingSpot.lat, parkingSpot.lng)
    };
    
    let panel = document.getElementById('directionsPanel');
    panel.innerHTML = " ";
    
    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));
    let request = {
        origin: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        destination: new google.maps.LatLng(parkingSpot.lat, parkingSpot.lng),
        travelMode: 'WALKING'
    };
    directionsService.route(request, function(response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
        }
    });
}