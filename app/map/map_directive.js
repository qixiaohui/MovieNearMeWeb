const _ = require('underscore');
const GoogleMapsLoader = require('google-maps');

GoogleMapsLoader.KEY = 'AIzaSyDOjFm5V6Ar1QeNIDa0_d_jjfDQ2KGR2Ts';

export default ngModule => {
    ngModule.directive("map", () => {
        require('./map.css');
        return {
            restrict: "E",
            scope: {
                location: '=',
                theaters:'='
            },
            template: require('./map.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope) {
                const vm = this;
                var map;
                var geocoder;
                var bounds;

                GoogleMapsLoader.load(function(google) {

                    var infoWindow = (marker, map, title, address) => {
                        google.maps.event.addListener(marker, 'click', function () {
                            var html = "<div><h3>" + title + "</h3><p>" + address + "</p></div>";
                            let iw = new google.maps.InfoWindow({
                                content: html,
                                maxWidth: 350
                            });
                            iw.open(map, marker);
                        });
                    }

                    var geocodeAddress = (address, title) => {
                        geocoder.geocode({'address': address}, (results, status) => {
                            if (status == google.maps.GeocoderStatus.OK){
                                var marker = new google.maps.Marker({
                                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
                                    map: map,
                                    animation: google.maps.Animation.DROP,
                                    position: results[0].geometry.location,
                                    title: title,
                                    address: address,
                                });
                                infoWindow(marker, map, title, address);
                                bounds.extend(marker.getPosition());
                                map.fitBounds(bounds);
                            }else {
                                alert("geocode of " + address + " failed:" + status);
                            }
                        });
                    };

                    bounds = new google.maps.LatLngBounds();
                    map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 8,
                        center: {lat: $scope.location.lati, lng: $scope.location.longi},
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scrollwheel: false
                    });
                    var marker = new google.maps.Marker({
                        position: {lat: $scope.location.lati, lng: $scope.location.longi},
                        map: map,
                        title: 'Your current location'
                    });
                    google.maps.event.addListener(map, 'click', function(event){
                        this.setOptions({scrollwheel:true});
                    });
                    geocoder = new google.maps.Geocoder();

                    //loop through theater address
                    _.each($scope.theaters, (theater) => {
                        geocodeAddress(theater.address, theater.name);
                    });
                });

                //initialize map
                //vm.initMap();
            }
        }
    })
};