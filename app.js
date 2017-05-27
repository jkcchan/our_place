// This example adds a red rectangle to a map.
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 43.476, lng: -80.536},
    mapTypeId: 'terrain'
  });
  dots = {}
}

function sendLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
          colour:
        };
        $.post("route/pixels", pos);
      }, function() {
        console.log("LOCATION DIDNT WORK")
      });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function getDots() {
  $.ajax({
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    url:'https://our-place.herokuapp.com/pixels',
    success: function(data) {
      $.each(data, function(index, element) {
        console.log(element)
      });
    }
  });
}
$(document).ready(function(){
  var is_interace_open = false;
  $("#peek").click(function(){
    if (is_interace_open){
      $("#peek").animate({"bottom":'0vh'});
    }
    else{
      $("#peek").animate({"bottom":'50vh'});
    }
      $("#drop_interface").slideToggle();
    is_interace_open = !is_interace_open;
  })
})
