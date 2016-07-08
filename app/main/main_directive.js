export default ngModule => {
    ngModule.directive("main", () => {
        require('./main.css');
        return {
            restrict: "E",
            scope: true,
            template: require('./main.html'),
            controllerAs: "vm",
            controller: function($rootScope, $location){
                const vm = this;
                vm.state = {currentPath: {name: 'main.tabs'}, previousPath: ''};
                $rootScope.appName = 'Movie near me';
                $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                    vm.state.currentPath = to;
                    vm.state.previousPath = from;

                });

                vm.statePop = () => {
                    if(vm.state.previousPath.name === 'main.tabs'){
                        $rootScope.appName = 'Movie near me';
                    }
                    $location.path(vm.state.previousPath);
                };
            }
        };
    });
};