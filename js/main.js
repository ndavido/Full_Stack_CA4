function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

window.onload = () => {
  let dkitLocation = { lat: 53.98485693, lng: -6.39410164 }


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
    position: dkitLocation,
    map: map
  })

  google.maps.event.addListener(marker, "click", () => {
    infoWindow.setContent("DkIT")
    infoWindow.open(map, marker)
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