export default ngModule => {
    ngModule.directive("channels", () => {
        require('./purchase.css');
        return {
            restrict: "E",
            scope: {
                channels: "="
            },
            template: require('./purchase.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope) {
                const vm = this;
                vm.channels = $scope.channels;

                vm.redirect = (url) => {
                    window.open(url,'_blank');
                };
            }
        }
    });
};