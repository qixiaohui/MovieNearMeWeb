export default ngModule => {
    ngModule.directive("main", () => {
        require('./main.css');
        return {
            restrict: "E",
            scope: true,
            template: require('./main.html'),
            controllerAs: "vm",
            controller: function(){
                const vm = this;
                vm.movieCategory = 'PLAYING_NOW';

            }
        };
    });
};