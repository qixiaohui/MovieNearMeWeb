export default ngModule => {
    ngModule.directive("signin", () => {
        require('./signin.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: true,
            template: require('./signin.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope, $location) {
                const vm = this;

                vm.register = () => {
                    $location.path('/main/register');
                };
            }
        }
    })
}