export default ngModule => {
    ngModule.directive("search", () => {
        require('./search.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: true,
            template: require('./search.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope, $location) {
                const vm = this;
            }
        }
    })
}