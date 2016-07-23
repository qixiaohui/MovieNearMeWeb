export default (ngModule, firebase, database) => {
    ngModule.directive("tabs", () => {
        require('./tabs.css');
        return {
            restrict: "E",
            scope: true,
            template: require('./tabs.html'),
            controllerAs: "vm",
            controller: function($rootScope, $scope, $location, $mdDialog){
                const vm = this;
                vm.sd = $scope.categoryIndex;
                vm.setTab = (index) => {
                    $rootScope.tabIndex = index;
                };

                vm.collectionPage = () => {
                    if(!firebase.auth().currentUser){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('body')))
                                .clickOutsideToClose(true)
                                .title('Signin')
                                .textContent('Please signin first.')
                                .ok('Got it!')
                        );
                    }else {
                        $location.path('/main/mycollection');
                    }
                };
            }
        };
    });
};