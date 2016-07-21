export default ngModule => {
    ngModule.directive("movies", () => {
        require('./movies.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: {
                category: '@',
                index: '='
            },
            template: require('./movies.html'),
            controllerAs: "vm",
            controller: function($scope, $rootScope, $location){
                const vm = this;
                vm.Math = window.Math;
                vm.movies = {};
                vm.category = $scope.category;
                vm.index = $scope.index;
                vm.totalPages = 0;

                vm.pagination = (index) => {
                    vm.index = index;
                    // bind to rootscope categoryIndex
                    $scope.index = index;
                    crud.GET(`/movies/${vm.category}/${vm.index}`, {}).then((response) => {
                        vm.movies = response.data;
                        vm.totalPages = response.data.total_pages;
                        $scope.$digest();
                        window.scrollTo(0, 0);
                        sessionStorage.setItem(vm.category, JSON.stringify(vm.movies));
                    }).catch((err) => {
                        console.error(err);
                    });
                };

                vm.forwardInfo = (info) => {
                    $rootScope.appName = info.title;
                    $rootScope.movieInfo = info;
                    $location.path('/main/info');
                };

                if(sessionStorage.getItem(vm.category)){
                    let movies = JSON.parse(sessionStorage.getItem(vm.category));
                    if(movies.page === vm.index){
                        vm.movies = movies;
                        vm.totalPages = movies.total_pages;
                    }else{
                        vm.pagination(vm.index);
                    }
                }else{
                    vm.pagination(vm.index);
                }

            }
        };
    });
};