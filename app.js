function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 43.476, lng: -80.536},
    mapTypeId: 'terrain'
  });
  rectangles = {};
  last_updated_at = 0;
}

function sendLocation(colour) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          colour: colour
        };
        $.ajax({
          url:'https://our-place.herokuapp.com/pixels',
          type: 'POST',
          crossDomain: true,
          contentType: 'application/json',
          data: pos,
          success: function(data) {
            renderRect(data);
          }
        });
      }, function() {
        console.log("LOCATION DIDNT WORK")
      });
    } else {
      console.log("GEOLOCATION NOT SUPPORTED");
    }
}

function getRects() {
  $.ajax({
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    data: {"last_updated_at": last_updated_at},
    url:'https://our-place.herokuapp.com/pixels',
    success: function(data) {
      last_updated_at = new Date().getTime()
      $.each(data, function(index, element) {
        console.log(element);
        renderRect(element);
      });
    }
  });
}
postPixel = function(colour){
  sendLocation(colour)
}

function renderRect(position) {
  key = position.north.concat(",", position.west);
  if (key in rectangles) {
    rectangles[key].setMap(null);
  }
  var rectangle = new google.maps.Rectangle({
    strokeColor: element.colour,
    strokeOpacity: .75,
    strokeWeight: 1,
    fillColor: element.colour,
    fillOpacity: 0.75,
    map: map,
    bounds: {
      north: position.north,
      south: position.south,
      east: position.east,
      west: position.west
    }
  });
  rectangles[key] = retangle;
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
  });
  $(".colour_box").click(function(){
    if($(this).hasClass('not_selected')){
      $(".colour_box").addClass('not_selected');
      $(this).removeClass('not_selected').addClass('selected')
      $("#post_pixel").css('background-color', $(this).css('background-color'))
    }
    else {
      $(this).removeClass('selected');
      $(".colour_box").addClass('not_selected')
      $("#post_pixel").css('background-color', 'grey')
    }
  });
  $("#post_pixel").click(function(){
    postPixel($(this).css('background-color'));
  })
})
