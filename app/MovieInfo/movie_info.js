const _ = require('underscore');
const crud = require('../service/crud');
const util = require('../util/util');

export default ngModule => {
    ngModule.directive("info", () => {
        require('./movie_info.css');
        return {
            restrict: "E",
            scope: true,
            template: require('./movie_info.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope, $mdDialog, $mdMedia) {
                const vm = this;

                $scope.$watch('vm.date.currentDate', (newValue, oldValue) => {
                    if(newValue.getDate() === oldValue.getDate()){
                        return;
                    }

                    let days = vm.date.currentDate.getDate() - vm.today.getDate();
                    vm.getTheaters(null, days);
                });

                vm.getTheaters = (argLocation, argDays) => {
                    var days = 0;

                    if(argLocation){
                        let location = argLocation;
                        var promise = new Promise((resolve, reject) => {
                            crud.GET(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&sensor=true`, {}).then((response) => {
                                _.each(response.data.results[0].address_components, (component) => {
                                   if(component.types[0] === 'postal_code'){
                                       vm.zip = component.short_name;
                                   }
                                });

                                vm.location = {};
                                vm.location.lati = location.coords.latitude;
                                vm.location.longi = location.coords.longitude;
                                sessionStorage.setItem('zip', JSON.stringify({zip: vm.zip, lati: location.coords.latitude, longi: location.coords.longitude}));
                                $scope.$digest();
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

                vm.reload = () => {

                    vm.info = $rootScope.movieInfo;
                    //this will decide if the show time will show
                    //condition: if release date month is older than 2 month
                    vm.shouldShowtime = true;
                    vm.today = new Date();
                    var releaseArr = vm.info.release_date.split('-');
                    var releaseDate = new Date(parseInt(releaseArr[0]), parseInt(releaseArr[1])-1, parseInt(releaseArr[2]));

                    if(util.compareDate(vm.today, releaseDate) > 60){
                        vm.shouldShowtime = false;
                    }else if(util.compareDate(releaseDate, vm.today) > 1){
                        vm.today = releaseDate;
                    }

                    vm.date = {
                        currentDate: vm.today,
                        maxDate: new Date(
                            vm.today.getFullYear(),
                            vm.today.getMonth(),
                            vm.today.getDate()+6),
                        minDate: vm.today
                    };

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
                        $scope.$digest();
                    }).catch((err) => {
                        console.error(err);
                    });

                    if(sessionStorage.getItem('zip')){
                        let zipObj = JSON.parse(sessionStorage.getItem('zip'));
                        vm.zip = zipObj.zip;
                        vm.location = {};
                        vm.location.lati = zipObj.lati;
                        vm.location.longi = zipObj.longi;
                        vm.getTheaters();
                    }else {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(vm.getTheaters);
                        } else {
                            //TODO: handle geolocation not supported
                        }
                    }
                };

                vm.openPlayer = (url) => {
                    window.open(url,'_blank');
                };

                vm.buyTicket = (url) => {
                    window.open(url,'_blank');
                };

                vm.showPerson = (person) => {
                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

                    $mdDialog.show({
                      controller: DialogController,
                      template: require('./person.html'),
                      locals: {
                        person: person
                      },
                      parent: angular.element(document.body),
                      clickOutsideToClose:true,
                      fullscreen: useFullScreen
                    });
                };

                vm.loadSimilar = (movie) => {
                    //push current movie to stack
                    $rootScope.stack.push(vm.info);
                    $rootScope.movieInfo = movie;
                    $rootScope.appName = vm.info.title;
                    vm.reload();
                };

                $rootScope.$on('pop', (event) => {
                    vm.reload();
                });

                vm.reload();

            }
        
    }});
};

function DialogController($scope, $mdDialog, person) {
  $scope.person = person;

    crud.GET(`/movie/person/${person.id}`, {}).then((response) => {
        $scope.person = response.data;
        $scope.$digest();
    }).catch((err) => {
        console.error(err);
    });

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}