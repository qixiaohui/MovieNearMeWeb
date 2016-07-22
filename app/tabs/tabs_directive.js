export default ngModule => {
    ngModule.directive("tabs", () => {
        require('./tabs.css');
        return {
            restrict: "E",
            scope: true,
            template: require('./tabs.html'),
            controllerAs: "vm",
            controller: function($rootScope, $scope){
                const vm = this;
                vm.sd = $scope.categoryIndex;
                $scope.toggleLeft = buildDelayedToggler('left');
                vm.setTab = (index) => {
                    $rootScope.tabIndex = index;
                };

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
                        $log.debug("toggle " + navID + " is done");
                      });
                  }, 200);
                }
            }
        };
    });
};