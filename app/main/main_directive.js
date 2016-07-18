export default (ngModule, firebase, provider) => {
    ngModule.directive("main", () => {
        require('./main.css');
        return {
            restrict: "E",
            scope: true,
            template: require('./main.html'),
            controllerAs: "vm",
            controller: function($rootScope, $location, $scope){
                //default add parameters on launch
                $rootScope.tabIndex = 0;
                $scope.categoryIndex = {
                    nowPlaying: 1,
                    topRate: 1,
                    popular: 1,
                    upComing: 1
                };

                //this will use as a stack to hold the movies
                //when select a movie the previous movie will be pushed in
                //when select
                $rootScope.stack = [];

                const vm = this;
                vm.state = {currentPath: {name: 'main.tabs'}, previousPath: ''};
                $rootScope.appName = 'Movie near you(Alpha)';
                $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                    vm.state.currentPath = to;
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

                /**
                 * firebase fb signin
                 * @type {firebase.User|null|*}
                 */
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        // User is signed in.
                        vm.user = user;
                        $location.path('/main/tabs');
                        $scope.$digest();
                    }else{
                        // User signed out
                        vm.user = null;
                        $scope.$digest();
                    }
                });
                
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

                vm.fblogout = () => {
                    firebase.auth().signOut().then(function() {
                        // Sign-out successful.
                    }, function(error) {
                        // An error happened.
                    });
                };

                vm.signinPage = () => {
                    $location.path('/main/signin');
                }
            }
        };
    });
};