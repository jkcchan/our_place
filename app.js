// This example adds a red rectangle to a map.

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: {lat: 33.678, lng: -116.243},
    mapTypeId: 'terrain'
  });

  var rectangle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    bounds: {
      north: 33.685,
      south: 33.671,
      east: -116.234,
      west: -116.251
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
