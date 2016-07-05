export default ngModule => {
    ngModule.directive("main", () => {
        require('./main.css');
        return {
            restrict: "E",
            scope: {},
            template: require('./main.html'),
            controllerAs: "vm",
            controller: function(){
                const vm = this;
            }
        };
    });
};