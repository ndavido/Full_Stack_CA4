let map = null
let latLng = { lat: 52.4796992, lng: -1.9026911 }
let placeType = "cafe"
let url = `json/commonwealthGames.json`
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

  const locationButton = document.createElement("button");
  let infoWindow = new google.maps.InfoWindow()

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

  directionsRenderer = new google.maps.DirectionsRenderer({ draggable: true })
  directionsRenderer.setMap(map)

  directionsRenderer.setPanel(document.getElementById("directions"))

  calculateRoute("DRIVING")


  const CONTENT = 0,
    LATITUDE = 1,
    LONGITUDE = 2

  locations.map(location => {
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(location[LATITUDE], location[LONGITUDE]),
      map: map
    })

    google.maps.event.addListener(marker, "click", () => {
      infoWindow.setContent(location[CONTENT])
      infoWindow.open(map, marker)
    })
  })
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
  let service = new google.maps.places.PlacesService(map)

  let icon = {
    url: place.icon, // url
    scaledSize: new google.maps.Size(30, 30), // scale the image to an icon size
  }

  let marker = new google.maps.Marker({
    map: map,
    icon: icon,
    position: place.geometry.location
  })

  google.maps.event.addListener(marker, "click", () => {
    request = {
      placeId: place.place_id,
      fields: ["name", "formatted_address", "place_id", "formatted_phone_number", "icon", "geometry", "business_status", "rating"],
    };
    service.getDetails(request, (placeDetails) => infoWindow.setContent(
      "<p><strong>"
      + placeDetails.name
      + "<p></strong>"
      + (placeDetails.formatted_address).replace(/,/g, ',<br>')
      + "<p>"
      + placeDetails.formatted_phone_number
      + "</p>"
      + placeDetails.business_status
      + "<p><br>"
      + placeDetails.rating
      + " Overall Rating</p>"))
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

  let CONTENT = 0,
    LATITUDE = 1,
    LONGITUDE = 2

  let locations = []

  fetch('json/commonwealthGames.json')
    .then(response => response.json())
    .then(jsonMapData => {
      jsonMapData.map(item => {
        locations.push([
          ` <div class="card">
              <img class="rounded-t-lg" src=${item.image}>
                <h5 class="title">${item.name}</h5>
                <p>${item.description}</p>
                <ul>
                  <li>${item.events}</li>
                </ul>
            </div>`,
          parseFloat(item.latitude),
          parseFloat(item.longitude)
        ])
      })

      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: new google.maps.LatLng(locations[0][LATITUDE], locations[0][LONGITUDE]),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })

      let infoBox = new InfoBox({
        disableAutoPan: true,
        pixelOffset: new google.maps.Size(-55, -195),
        boxStyle: {
          opacity: 1,
          width: "100"
        },
        closeBoxMargin: "80px 80px 0px 0px",
        closeBoxURL: "close_image.png",
        infoBoxClearance: new google.maps.Size(1, 1)
      })

      locations.map(location => {
        let marker = new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(location[LATITUDE], location[LONGITUDE])
        })

        google.maps.event.addListener(marker, "click", () => {
          infoBox.setContent(location[CONTENT])
          map.panTo({ lat: location[LATITUDE], lng: location[LONGITUDE] })
          infoBox.open(map, marker)
        })
      })
    })

  let styledMapType = new google.maps.StyledMapType(styles, { name: "Events", alt: "Commonwealth Games" })
  map.mapTypes.set("hide_poi", styledMapType)

  map.setMapTypeId("hide_poi")
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