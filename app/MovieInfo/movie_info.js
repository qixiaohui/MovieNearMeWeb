const _ = require('underscore');

export default ngModule => {
    ngModule.directive("info", () => {
        require('./movie_info.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: true,
            template: require('./movie_info.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope) {
                const vm = this;
                vm.info = $rootScope.movieInfo;

                crud.GET(`/movie/info/${vm.info.id}`, {}).then((response) => {
                    _.extend(vm.info, response.data);
                    $scope.$digest();
                }).catch((err) => {
                    console.error(err);
                });

                crud.GET(`/movie/similar/${vm.info.id}`, {}).then((response) => {
                    vm.info.similar = response.data.results;
                    $scope.$digest();
                }).catch((err) => {
                    console.error(err);
                });

                crud.GET(`/movie/video/${vm.info.title}`, {}).then((response) => {
                    vm.info.videos = response.data;
                    $scope.$digest();
                }).catch((err) => {
                    console.error(err);
                    vm.info.videos = [];
                    $scope.$digest();
                });

                crud.GET(`/movie/credit/${vm.info.id}`, {}).then((response) => {
                    vm.info.credit = response.data;
                    debugger;
                    $scope.$digest();
                }).catch((err) => {
                    console.error(err);
                });

                vm.getTheaters = (argLocation, argDays) => {
                    var days = 1;

                    if(argLocation){
                        let location = argLocation;
                        var promise = new Promise((resolve, reject) => {
                            crud.GET(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&sensor=true`, {}).then((response) => {
                                let length = response.data.results[0].address_components.length;
                                vm.zip = response.data.results[0].address_components[length-1].short_name;
                                sessionStorage.setItem('zip', vm.zip);
                                resolve();
                            }).catch((err) => {
                                console.error(err);
                                reject();
                            });
                        });
                    }else{
                        if(!vm.zip){
                            return;
                        }else{
                            var promise = new Promise((resolve, reject) => {
                                resolve();
                            });
                        }
                    }

                    if(argDays){
                        days = argDays;
                    }

                    promise.then(() => {
                        crud.GET(`/schedule/theaters/${vm.info.title}/${vm.zip}/${days}`, {}).then((response) => {
                            vm.info.theaters = [];
                            _.each(response.data, (theater) => {
                                theater.movie = [];
                                _.each(theater.movies, (movie) => {
                                    if(movie.name.trim().toUpperCase().replace(/[^A-Z0-9]+/ig, "").indexOf(vm.info.title.trim().toUpperCase().replace(/[^A-Z0-9]+/ig, "")) > -1){
                                        theater.movie.push(movie);
                                    }
                                });
                                if(theater.movie.length > 0){
                                    theater.movies = null;
                                    vm.info.theaters.push(theater);
                                }
                            });
                            debugger;
                            $scope.$digest();
                        }).catch((err) => {
                            console.error(err);
                            vm.info.theaters = [];
                            $scope.$digest();
                        });
                    }).catch(() => {
                        return;
                    });
                };

                if(sessionStorage.getItem('zip')){
                    vm.zip = sessionStorage.getItem('zip');
                    vm.getTheaters();
                }else {
                    if (navigator.geolocation) {
                        debugger;
                        navigator.geolocation.getCurrentPosition(vm.getTheaters);
                    } else {
                        debugger;
                        //TODO: handle geolocation not supported
                    }
                }

                vm.openPlayer = (url) => {
                    window.open(url,'_blank');
                };
            }
        }
    });
}