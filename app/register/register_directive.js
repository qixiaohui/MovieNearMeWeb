export default ngModule => {
    ngModule.directive("register", () => {
        require('./register.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: true,
            template: require('./register.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope, $location) {
                const vm = this;
                
            }
        }
    })
}