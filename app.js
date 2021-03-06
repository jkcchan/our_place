function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 43.476, lng: -80.536},
    mapTypeId: 'terrain'
  });
  rectangles = {};
}
function roundTo(n, digits) {
  if (digits === undefined) {
    digits = 0;
  }

  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  var test =(Math.round(n) / multiplicator);
  return +(test.toFixed(2));
}

function sendLocation(colour) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude =  position.coords.latitude;
        var longitude = position.coords.longitude;
        map.setCenter(new google.maps.LatLng(latitude, longitude));
        map.setZoom(20);
        var pos = {
          latitude: latitude,
          longitude: longitude,
          colour: colour
        };
        $.ajax({
          url:'https://our-place.herokuapp.com/pixels',
          type: 'POST',
          crossDomain: true,
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(pos),
          success: function(data) {
            renderRect(data);
          }
        }, function(error) {
          console.log("Error with the request");
        }, {maximumAge:10000});
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
    data: {last_updated_at: last_updated_at, swag:"swag"},
    url:'https://our-place.herokuapp.com/pixels',
    success: function(data) {
      last_updated_at = (new Date().getTime()/1000)
      $.each(data, function(index, element) {
        renderRect(element);
      });
    }
  });
}
function postPixel(colour){
  sendLocation(rgb2hex(colour))
}

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}
function renderRect(position) {
  key = position.south + "," + position.west;
  if (key in rectangles) {
    rectangles[key].setMap(null);
  }
  var rectangle = new google.maps.Rectangle({
    strokeColor: position.colour,
    strokeOpacity: .75,
    strokeWeight: 1,
    fillColor: position.colour,
    fillOpacity: 0.75,
    map: map,
    bounds: {
      north: position.north,
      south: position.south,
      east: position.east,
      west: position.west
    }
  });
  rectangles[key] = rectangle;
}

function signUp(email, password) {
  console.log("ASDF");
  $.ajax({
    type: 'POST',
    crossDomain: true,
    dataType: 'json',
    data: JSON.stringify({email: email, password:password}),
    contentType: 'application/json',
    url:'https://our-place.herokuapp.com/users',
    success: function(data) {
      console.log(data);
      if (data.token) {
        token = data.token;
        localEmail = data.email
        $("#overlay").fadeOut();
        $("#login_form").fadeOut();
      }
    }
  });
}

function signIn(email, password) {
  $.ajax({
    type: 'POST',
    crossDomain: true,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({email: email, password:password}),
    url:'https://our-place.herokuapp.com/login',
    success: function(data) {
      console.log(data);
      if (data.token) {
        token = data.token;
        localEmail = data.email
        $("#overlay").fadeOut();
        $("#login_form").fadeOut();
      }
    },
  });
}

function logout() {
  $.ajax({
    type: 'DELETE',
    crossDomain: true,
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization token=', token);
    },
    url:'https://our-place.herokuapp.com/logout',
    success: function(data) {
    },
  });
}

function centerLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude =  position.coords.latitude;
      var longitude = position.coords.longitude;
      map.setCenter(new google.maps.LatLng(latitude, longitude));
      map.setZoom(17);
    });
  }
}
$(document).ready(function(){
  
  last_updated_at = 0;
  var is_interace_open = false;
  getRects();
  centerLocation();
  localEmail = "";
  token = "";
  var myVar = setInterval(function(){getRects()}, 2000);
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
      $("#post_pixel").css({'background-color': $(this).css('background-color'), 'color':'white'})
    }
    else {
      $(this).removeClass('selected');
      $(".colour_box").addClass('not_selected')
      $("#post_pixel").css({'background-color': '#455a64', 'color':'#eeeeee'});
    }
  });
  $("#post_and_protect").click(function(){
    $("#buy").click();
    return;
  })
  $("#post_pixel").click(function(){
    var c = $(this).css('background-color')
    if(c == 'rgb(62, 65, 83)'){return;}
    else if(c == 'rgb(0, 0, 0)' || c == 'rgb(156, 39, 176)'){
      $("#buy").click();
      return;
    }
    else{
      postPixel($(this).css('background-color'));
      $("#peek").click();
    }
  });
  $("#login").click(function(){
    $("#paypal").hide();
    $("#overlay").fadeIn();
    $("#modal").animate({"opacity":1});
    $("#login_form").fadeIn();
  });
  $("#logout").click(function(){
    logout();

    $("#login").css('display','inline');
    $("#logout").hide();
  })
  $("#buy").click(function(){
    $("#login_form").hide();
    $("#overlay").fadeIn();
    $("#modal").animate({"opacity":1});
    $("#paypal").fadeIn();
  });
  $("#overlay").click(function(e){
    if(e.target.id != "overlay"){
      return;
    }
    else{
    $("#overlay").fadeOut();
    $("#modal").animate({"opacity":0});
    $("#paypal").fadeOut();
    $("#login_form").fadeOut();
    }
  });
  $("#sign_in").click(function(){
      var username = $("#username").val()
      var password = $("#password").val()
      signIn(username, password);
      $("#overlay").click();
    $("#login").hide();
    $("#logout").css('display','inline');
  })
  $("#sign_up").click(function(){
      var username = $("#username").val()
      var password = $("#password").val()
      signUp(username, password);
$("#overlay").click();
    $("#login").hide();
    $("#logout").css('display','inline');
  })
});
