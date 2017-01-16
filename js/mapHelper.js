var MapHelper = {};

(function($) {

    var map,
        mapElement,
        markersArray = [];

    var defaults = {
        zoom: 4,
        us_center_lat: 39.80,
        us_center_long: -98.50,
        home_zoom: 14
    };

    function initialize() {
        map = new google.maps.Map(mapElement, {
            center: getLatLng(defaults.us_center_lat, defaults.us_center_long),
            zoom: defaults.zoom
        });

        MapHelper.findGeoLocation(function(position) {
            var latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                icon: 'images/markers/home.png',
                title: 'My Location'
            };

            MapHelper.setMarkers([latLng], true);

        }, function(error) {
            console.log(error);
        });
    }

    function getLatLng(lat, lng) {
        var obj = new google.maps.LatLng(lat, lng);
        return obj;
    }

    MapHelper.findGeoLocation = function(successCallback, erroCallback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                successCallback.call(window, position);
            }, function(error) {
                erroCallback.call(window, error);
            });
        }
    }

    MapHelper.init = function(mapElem) {
        mapElement = mapElem;

        google.maps.event.addDomListener(window, 'load', initialize);
    };


    MapHelper.setMarkers = function(latLngArray, isHomeIcon) {

        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < latLngArray.length; i++) {
            var arrObj = latLngArray[i];
            var latLng = getLatLng(arrObj.lat, arrObj.lng);
            bounds.extend(latLng);

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: arrObj.icon,
                title: arrObj.title
            });

            if (!isHomeIcon) {
                markersArray.push(marker);
            }
        }
        map.setCenter(bounds.getCenter());

        if (!isHomeIcon) {
            map.fitBounds(bounds);
        } else {
            map.setZoom(defaults.home_zoom);
        }
    };

    MapHelper.clearMarkers = function() {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    };

})(jQuery);
