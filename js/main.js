window.onload = () => {
  let Birmingham = { lat: 52.4796992, lng: -1.9026911 }


  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: new google.maps.LatLng(52.4796992, -1.9026911),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControlOptions: {
      mapTypeIds: ["roadmap", "hide_poi"]
    }
  })

  hidePointsOfInterest(map)

  let infoWindow = new google.maps.InfoWindow()


  let marker = new google.maps.Marker({
    position: Birmingham,
    map: map
  })

  google.maps.event.addListener(marker, "click", () => {
    infoWindow.setContent("Birmingham")
    infoWindow.open(map, marker)
  })

  new google.maps.places.Autocomplete(start)
  new google.maps.places.Autocomplete(middle)
  new google.maps.places.Autocomplete(end)

  directionsRenderer = new google.maps.DirectionsRenderer()
  directionsRenderer.setMap(map)

  directionsRenderer.setPanel(document.getElementById("directions"))

  calculateRoute("DRIVING")
}

function calculateRoute(travelMode = "DRIVING") {
  document.getElementById("transport-mode").innerHTML = travelMode
  let start = document.getElementById("start").value
  let waypts = [];
  let waypoints = document.getElementById("middle").value
  let end = document.getElementById("end").value

  for (let i = 0; i < waypoints.length; i++) {
    if (waypoints.options[i].selected) {
      waypts.push({
        location: waypoints[i].value,
        stopover: true,
      });
    }
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