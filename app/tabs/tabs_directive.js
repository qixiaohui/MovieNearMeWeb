export default ngModule => {
    ngModule.directive("tabs", () => {
        require('./tabs.css');
        return {
            restrict: "E",
            scope: true,
            template: require('./tabs.html'),
            controllerAs: "vm",
            controller: function(){

            }
        };
    });
};