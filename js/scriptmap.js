

function initialize() {
        var mapOptions = {
          center: { lat: -22.2202467, lng: -45.9155238},
          zoom: 17
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
          
        var marker = new google.maps.Marker({
            position : new google.maps.LatLng(ponto.lat, ponto.lng),
            title: "Your Pizza!",
            map: map,
            icon:'img/markerpizza.png'
});  
                   
          
      }
      google.maps.event.addDomListener(window, 'load', initialize);

    