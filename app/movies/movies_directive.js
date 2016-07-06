export default ngModule => {
    ngModule.directive("movies", () => {
        require('./movies.css');
        const axios = require('../service/crud');
        return {
            restrict: "E",
            scope: {
                category: '@'
            },
            template: require('./movies.html'),
            controllerAs: "vm",
            controller: function($scope){
                const vm = this;
                vm.movies = {};
                vm.category = $scope.category;
                axios.GET(`/movies/${vm.category}/1`, {}).then((response) => {
                    vm.movies = response.data;
                    $scope.$digest();
                }).catch((err) => {
                    console.error(err);
                });
            }
        };
    });
};