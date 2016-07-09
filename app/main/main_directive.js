export default ngModule => {
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
                    nowPlaying: {index: 1},
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
                        debugger;
                    }
                };
            }
        };
    });
};