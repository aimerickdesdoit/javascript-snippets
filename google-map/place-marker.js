var lat = $(this).closest('.region_zone').find('[id$="_lat"]');
var lng = $(this).closest('.region_zone').find('[id$="_lng"]');

var center = new google.maps.LatLng(lat.val() || 48.8566667, lng.val() || 2.350987099999986);

var locationMap = new google.maps.Map(document.getElementById(id), {
  zoom : 4,
  center : center,
  mapTypeId : google.maps.MapTypeId.ROADMAP,
  streetViewControl: false,
  scaleControl : false,
  mapTypeControl : false
});

marker = new google.maps.Marker( {
  map: locationMap,
  position: center,
  draggable: true,
  visible: lat.val() && lng.val() ? true : false
});
google.maps.event.addListener(marker, 'dragend', function(event) {
    lat.val(event.latLng.lat());
    lng.val(event.latLng.lng());
    locationMap.panTo(event.latLng);
});

google.maps.event.addListener(locationMap, 'click', function(event) {
  if(!marker.visible){
    marker.setVisible(true);
    marker.setPosition(event.latLng);
    lat.val(event.latLng.lat());
    lng.val(event.latLng.lng());
    locationMap.panTo(event.latLng);
  }
});