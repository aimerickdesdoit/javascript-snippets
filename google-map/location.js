// documentation : http://code.google.com/intl/fr/apis/maps/documentation/javascript/

(function($) {
  $.locationOnGoogleMaps = function(id, lat, long, fieldsSelector, zoom) {

    // élément cible qui contiendra les coordonnées
    var $gps = $('#' + id);
    var $zoom = $('#' + id + '-zoom');

    // élément de recherche
    var locationFieldSet = $(fieldsSelector);

    // éléments pour l'affichage des messages
    var multipleResultsMessage = $('#' + id + '-message').hide();
    var notFoundMessage = $('#' + id + '-message-not-found').hide();
    
    // restauration des valeurs des champs
    var value = $.trim($zoom.val());
    if (!value || value == '') {
        zoom = zoom || 16;
    }
    else {
        zoom = parseInt(value);
    }
    $zoom.val(zoom);
    
    var value = $.trim($gps.val());
    if (!value || value == '') {
      // centre de la carte par défaut
      var center = new google.maps.LatLng(lat, long);
      $gps.val(center);
    }
    else {
      // restauration de la valeur du champ
      var latlng = value.substring(1, value.length - 1).split(',');
      var center = new google.maps.LatLng($.trim(latlng[0]), $.trim(latlng[1]));
    }

    // construction de la carte
    var locationMap = new google.maps.Map($('#' + id + '-map').get(0), {
      zoom : zoom,
      center : center,
      mapTypeId : google.maps.MapTypeId.ROADMAP,
      scaleControl : false,
      mapTypeControl : false
    });
    google.maps.event.addListener(locationMap, 'zoom_changed', function(event) {
      if (locationMap.getZoom() > 17){
        locationMap.setZoom(17);
      }
      $zoom.val(locationMap.getZoom());
    });

    // marqueur principal
    var marker = new google.maps.Marker( {
      map : locationMap,
      position : center,
      draggable : true
    });
    google.maps.event.addListener(marker, 'dragend', function(event) {
      setLocation(marker.getPosition());
    });
    google.maps.event.addListener(locationMap, 'click', function(event) {
      setLocation(event.latLng);
    });

    // changement de la position du marqueur principal
    function setLocation(location, bounds) {
      marker.setPosition(location);
      marker.setVisible(true);
      if (bounds) {
        locationMap.fitBounds(bounds);
      }
      locationMap.panTo(location);
      $gps.val(locationMap.getCenter());
    }

    // multi marqueurs
    var multiMarkers = [];
    function hideMultiMarkers() {
      multipleResultsMessage.hide();
      notFoundMessage.hide();
      if (multiMarkers.length != 0) {
        for ( var i = 0, count = multiMarkers.length; i < count; i++) {
          multiMarkers[i].setVisible(false);
        }
      }
    }

    function getResultSetBounds(results) {
      var bounds = new google.maps.LatLngBounds();
      for ( var i = 0, count = results.length; i < count; i++) {
        if (!bounds.contains(results[i].geometry.location)) {
          bounds.extend(results[i].geometry.location);
        }
      }
      return bounds;
    }

    // évènement sur le champ de recherche
    var geocoder = new google.maps.Geocoder();
    var change = function() {
      hideMultiMarkers();

      // si la recherche est composée de plusieurs champs
      var address = [];
      locationFieldSet.each(function() {
        address.push($(this).val());
      });

      geocoder.geocode( {'address' : address.join(', ')}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          // si on a un seul résultat, on change la position du marqueur principal
          if (results.length == 1) {
            setLocation(results[0].geometry.location, results[0].geometry.viewport);
            return true;
          }
          // si on a plusieurs résultats, on créé tous les marqueurs
          else {
            for ( var i = 0, count = results.length; i < count; i++) {
              if (multiMarkers[i]) {
                multiMarkers[i].setPosition(results[i].geometry.location);
                multiMarkers[i].setVisible(true);
              }
              else {
                multiMarkers[i] = new google.maps.Marker( {
                  map : locationMap,
                  position : results[i].geometry.location
                });

                google.maps.event.addListener(multiMarkers[i], 'click', function() {
                    setLocation(this.getPosition(), this._bounds);
                    hideMultiMarkers();
                });
              }
              multiMarkers[i]._bounds = results[i].geometry.viewport
            }
            multipleResultsMessage.show();
            locationMap.fitBounds(getResultSetBounds(results));
            $gps.val('');
          }
        }
        else {
          notFoundMessage.show();
        }
        marker.setVisible(false);
        $gps.val('');
        return false;
      });
    };
    
    // lancement de la recherche avec une cadence de frappe fixée à 500ms
    var t = null, v = null;
    locationFieldSet.keyup(function(){
      clearTimeout(t);
      var val = $(this).val()
      if(val != v){
        v = val;
        t = setTimeout(function(){
          change();
        }, 500);
      }
    });
  }
})(jQuery);