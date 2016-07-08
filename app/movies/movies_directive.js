export default ngModule => {
    ngModule.directive("movies", () => {
        require('./movies.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: {
                category: '@'
            },
            template: require('./movies.html'),
            controllerAs: "vm",
            controller: function($scope, $rootScope, $location){
                const vm = this;
                vm.movies = {};
                vm.category = $scope.category;
                vm.index = 1;
                vm.totalPages = 0;

                vm.pagination = (index) => {
                    vm.index = index;
                    crud.GET(`/movies/${vm.category}/${vm.index}`, {}).then((response) => {
                        vm.movies = response.data;
                        vm.totalPages = response.data.total_pages;
                        $scope.$digest();
                        window.scrollTo(0, 0);
                    }).catch((err) => {
                        console.error(err);
                    });
                };

                vm.forwardInfo = (info) => {
                    $rootScope.appName = info.title;
                    $rootScope.movieInfo = info;
                    $location.path('/main/info');
                };

                vm.pagination(1);
            }
        };
    });
};