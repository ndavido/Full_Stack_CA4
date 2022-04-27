let map = null
let latLng = { lat: 52.4796992, lng: -1.9026911 }
let placeType = "cafe"
window.onload = () => {

  let services_centre_location = { lat: 52.4796992, lng: -1.9026911 }

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: new google.maps.LatLng(services_centre_location),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControlOptions: {
      mapTypeIds: ["roadmap", "hide_poi", "showEvents"]
    }
  })
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  hidePointsOfInterest(map)

  showBirminghamEvents(map)

  displayMap()

  map.addListener("click", (mapsMouseEvent) => {
    latLng = mapsMouseEvent.latLng.toJSON()
    displayMap()
  })

  new google.maps.places.Autocomplete(start)
  new google.maps.places.Autocomplete(middle)
  new google.maps.places.Autocomplete(end)

  directionsRenderer = new google.maps.DirectionsRenderer()
  directionsRenderer.setMap(map)

  directionsRenderer.setPanel(document.getElementById("directions"))

  calculateRoute("DRIVING")
}


function displayMap() {
  let service = new google.maps.places.PlacesService(map)

  service.nearbySearch({
    location: latLng, // centre of the search
    radius: 1000, // radius (in metres) of the search
    type: placeType
  }, getNearbyServicesMarkers)

  map.setZoom(15)
  map.panTo(new google.maps.LatLng(latLng.lat, latLng.lng))
}


let markers = []
function getNearbyServicesMarkers(results, status) {
  markers.map(marker => marker.setVisible(false))
  markers = []
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    results.map(result => {
      createMarker(result)
    })
  }
}


let infoWindow = new google.maps.InfoWindow()
function createMarker(place) {
  let icon = {
    url: place.icon, // url
    scaledSize: new google.maps.Size(30, 30) // scale the image to an icon size
  }

  let marker = new google.maps.Marker({
    map: map,
    icon: icon,
    position: place.geometry.location
  })

  markers.push(marker)

  google.maps.event.addListener(marker, "click", () => {
    infoWindow.setContent(place.name)
    infoWindow.open(map, marker)
  })
}

function calculateRoute(travelMode = "DRIVING") {
  document.getElementById("transport-mode").innerHTML = travelMode
  let start = document.getElementById("start").value
  let waypts = [];
  let waypoints = document.getElementById("middle").value
  let end = document.getElementById("end").value

  if (start === "" || end === "") {
    return
  }


    if (waypoints != "") {
      waypts.push({
        location: waypoints,
        stopover: true,
      });
    }
  

  let request = {
    origin: start,
    destination: end,
    waypoints: waypts,
    travelMode: travelMode
  }

  directionsService = new google.maps.DirectionsService()
  directionsService.route(request, (route, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(route)
    }
  })
}

function hidePointsOfInterest(map) {
  let styles = [
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]
    }
  ]


  let styledMapType = new google.maps.StyledMapType(styles, { name: "POI Hidden", alt: "Hide Points of Interest" })
  map.mapTypes.set("hide_poi", styledMapType)

  map.setMapTypeId("hide_poi")
}

function showBirminghamEvents(map) {
  let styles = [
    {
      "featureType": "poi",
      "stylers": [{ "visibility": "off" }]
    }
  ]

  let styledMapType = new google.maps.StyledMapType(styles, { name: "Events", alt: "Common Wealth Games Events" })
  map.mapTypes.set("showEvents", styledMapType)

  map.setMapTypeId("showEvents")

  let infoWindow = new google.maps.InfoWindow()
  let marker = new google.maps.Marker({
    position: { lat: 52.4796992, lng: -1.9026911 },
    map: map
  })

  google.maps.event.addListener(marker, "click", () => {
    infoWindow.setContent("Birmingham")
    infoWindow.open(map, marker)
  })
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
