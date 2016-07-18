const _ = require('underscore');
const crud = require('../service/crud');
const util = require('../util/util');
const key = 'AIzaSyDOjFm5V6Ar1QeNIDa0_d_jjfDQ2KGR2Ts';

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
                            crud.GET(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${key}&sensor=true`, {}).then((response) => {
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
                        let titleEncoded = vm.info.title.split(" ").join("+");
                        crud.GET(`/schedule/theaters/${titleEncoded}/${vm.zip}/${days}`, {}).then((response) => {

                            const pushShowTime = (schedules, container) => {
                                _.each(schedules, (schedule) => {
                                    container.showtimes.push(schedule.time);
                                    if(schedule.url){
                                        let replacedUrl = schedule.url.replace('/url?q=','');
                                        let key = schedule.time;
                                        container.showtime_tickets[key] = replacedUrl;
                                    }
                                });
                            };

                            const pushMovie = (theater) => {
                                let obj = {
                                    name: theater.theater,
                                    address: theater.address,
                                    movie: [{
                                        name: response.data.movies[0].title,
                                        showtimes: [],
                                        showtime_tickets: {}
                                    }]
                                };

                                pushShowTime(theater.schedule, obj.movie[0]);

                                vm.info.theaters.push(obj);
                            };

                            vm.info.theaters = [];
                            if(response.data.movies.length > 0){
                                _.each(response.data.movies[0].theaters, (theater) => {
                                    pushMovie(theater);
                                });
                            }

                            if(response.data.movies.length > 1){
                                response.data.movies.splice(0, 1);
                                _.each(response.data.movies, (movieObj) => {
                                    _.each(movieObj.theaters, (theaterObj) => {
                                        let match = false;
                                      _.find(vm.info.theaters, (theater) =>{
                                            if(theater.name == theaterObj.theater){
                                                match = true;
                                                let matched = {
                                                    name: movieObj.title,
                                                    showtimes: [],
                                                    showtime_tickets: {}
                                                };

                                                pushShowTime(theaterObj.schedule, matched);

                                                theater.movie.push(matched);
                                                return;
                                            }
                                        });

                                        if(!match){
                                            pushMovie(theaterObj);
                                        }
                                    });
                                });
                            }


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
                    vm.shouldPurchase = true;
                    vm.today = new Date();
                    var releaseArr = vm.info.release_date.split('-');
                    var releaseDate = new Date(parseInt(releaseArr[0]), parseInt(releaseArr[1])-1, parseInt(releaseArr[2]));

                    if(util.compareDate(vm.today, releaseDate) > 60){
                        vm.shouldShowtime = false;
                    }else if(util.compareDate(releaseDate, vm.today) > 1){
                        vm.today = releaseDate;
                        // movie is not released yet, no purchase option avilable
                        vm.shouldPurchase = false;
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

                    //if false shouldn't call purchase
                    if(vm.shouldPurchase) {
                        crud.GET(`/schedule/avilableon/webpurchase/${vm.info.id}`, {}).then((response) => {
                            vm.info.purchaseChannels = response.data;
                            $scope.$digest();
                        }).catch((err) => {
                            console.error(err);
                        });
                    }

                    //if false then shouldn't search show time at all
                    if(vm.shouldShowtime) {
                        if (sessionStorage.getItem('zip')) {
                            let zipObj = JSON.parse(sessionStorage.getItem('zip'));
                            vm.zip = zipObj.zip;
                            vm.location = {};
                            vm.location.lati = zipObj.lati;
                            vm.location.longi = zipObj.longi;
                            vm.getTheaters();
                        } else {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(vm.getTheaters);
                            } else {
                                //TODO: handle geolocation not supported
                            }
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
