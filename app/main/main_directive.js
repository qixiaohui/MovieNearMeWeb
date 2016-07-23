export default (ngModule, firebase, provider, database) => {
    ngModule.directive("main", () => {
        require('./main.css');
        return {
            restrict: "E",
            scope: true,
            template: require('./main.html'),
            controllerAs: "vm",
            controller: function($rootScope, $location, $scope, $timeout, $mdSidenav, $mdDialog){
                //default add parameters on launch
                $rootScope.tabIndex = 0;
                $scope.categoryIndex = {
                    nowPlaying: 1,
                    topRate: 1,
                    popular: 1,
                    upComing: 1
                };
                $scope.signinHint = false;
                $scope.toggleLeft = buildDelayedToggler('left');

                function debounce(func, wait, context) {
                  var timer;
                  return function debounced() {
                    var context = $scope,
                        args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function() {
                      timer = undefined;
                      func.apply(context, args);
                    }, wait || 10);
                  };
                }

                function buildDelayedToggler(navID) {
                  return debounce(function() {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                      .toggle()
                      .then(function () {
                        console.debug("toggle " + navID + " is done");
                      });
                  }, 200);
                }

                //this will use as a stack to hold the movies
                //when select a movie the previous movie will be pushed in
                //when select
                $rootScope.stack = [];

                const vm = this;
                vm.showSearch = false;
                vm.state = {currentPath: {name: 'main.tabs'}, previousPath: ''};
                $rootScope.appName = 'Movie near you(Alpha)';
                $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                    vm.state.currentPath = to;
                    if(vm.state.currentPath.name === 'main.tabs'){
                        $rootScope.appName = 'Movie near you(Alpha)';
                    }
                    vm.state.previousPath = from;
                });
                
                vm.statePop = () => {
                    if($rootScope.stack.length === 0) {
                        if (vm.state.previousPath.name === 'main.tabs') {
                            $rootScope.appName = 'Movie near you(Alpha)';
                        }
                        $location.path(vm.state.previousPath);
                    }else{
                        let movie = $rootScope.stack.pop();
                        $rootScope.appName = movie.title;
                        $rootScope.movieInfo = movie;
                        $rootScope.$broadcast('pop', {});
                    }
                };

                //redirec to main.search on click search
                vm.searchPage = () => {
                    $location.path('/main/search');
                    vm.showSearch = !vm.showSearch;
                };

                //redirect to main.tabs page
                vm.mainPage = () => {
                    $location.path('/main/tabs');
                    vm.showSearch = !vm.showSearch;
                    //clear the history when return
                    $scope.searchKeyword = null;
                    vm.searchContent = null;
                };

                // call search onsubmit
                vm.search = () => {
                    //only update when on submit or ng click
                    $scope.searchKeyword = vm.searchContent;
                };

                /**
                 * add movie to collection
                 * @param movie
                 */
                $scope.addCollection = (movieCopy) => {
                    let movie = angular.copy(movieCopy);
                    if(!firebase.auth().currentUser){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('body')))
                                .clickOutsideToClose(true)
                                .title('Signin')
                                .textContent('Please signin first.')
                                .ok('Got it!')
                        );
                    }else{
                        var userId = firebase.auth().currentUser.uid;
                        database.ref(`/users/${userId}`).once('value').then((snapshot) => {
                            if((snapshot.val() && snapshot.val().mycollection) && (Object.keys(snapshot.val().mycollection).length >=50)){
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('body')))
                                        .clickOutsideToClose(true)
                                        .title('Maximum capacity')
                                        .textContent('Sorry about the inconvinent, we can only store up to 50 movies at this time, please delete some movie and try again.')
                                        .ok('Got it!')
                                );
                                return;
                            }

                            let push = () => {
                                database.ref(`users/${userId}/mycollection/`).push(movie);
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('body')))
                                        .clickOutsideToClose(true)
                                        .title('Success')
                                        .textContent('New movie added!')
                                        .ok('Got it!')
                                );
                            };

                            if((snapshot.val() && snapshot.val().mycollection)){
                                let showDialog = () => {
                                    $mdDialog.show(
                                        $mdDialog.alert()
                                            .parent(angular.element(document.querySelector('body')))
                                            .clickOutsideToClose(true)
                                            .title('Duplicate')
                                            .textContent('Seems like you already have this movie in your collection.')
                                            .ok('Got it!')
                                    );
                                };

                                for(let key in snapshot.val().mycollection){
                                    if(snapshot.val().mycollection[key].id === movie.id){
                                        showDialog();
                                        return;
                                    }
                                }

                                push();

                            }else{
                                push();
                            }
                        });
                    }
                };

                /**
                 * firebase fb signin
                 * @type {firebase.User|null|*}
                 */
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        // User is signed in.
                        vm.user = user;
                        $location.path('/main/tabs');
                        $scope.emailSigninError = false;
                        $scope.registerErrorMessage = null;
                        // need to call apply since need to check update from rootscope
                        $scope.$apply();
                    }else{
                        // User signed out
                        vm.user = null;
                        $scope.$digest();
                    }
                });

                /**
                 * signing in using facebook account
                 */
                $scope.fbsignin = () => {
                    firebase.auth().signInWithPopup(provider).then(function(result) {
                        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                        var token = result.credential.accessToken;
                    }).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                    });
                };

                /**
                 * signing out using facebook account
                 */
                vm.fblogout = () => {
                    firebase.auth().signOut().then(function() {
                        // Sign-out successful.
                    }, function(error) {
                        // An error happened.
                    });
                };

                /**
                 * email password signin
                 */
                $scope.emailsignin = (email, password) => {
                    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        $scope.signinErrorMessage = error.message;
                        $scope.emailSigninError =true;
                        $scope.$digest();
                    });
                };

                /**
                 * email password signout
                 */
                vm.emailsignout = () => {
                    firebase.auth().signOut().then(function() {
                        // Sign-out successful.
                    }, function(error) {
                        // An error happened.
                    });
                };

                /**
                 * email password register
                 */
                $scope.emailregister = (email, password) => {
                    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        $scope.registerErrorMessage = error.message;
                        $scope.$digest();
                        // ...
                    });
                };

                vm.signinPage = () => {
                    $location.path('/main/signin');
                }
            }
        };
    });
};