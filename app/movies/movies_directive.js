export default ngModule => {
    ngModule.directive("movies", () => {
        require('./movies.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: {
                category: '@',
                index: '=',
                keyword: '='
            },
            template: require('./movies.html'),
            controllerAs: "vm",
            controller: function($scope, $rootScope, $location){
                const vm = this;
                vm.Math = window.Math;
                vm.movies = {};
                vm.category = $scope.category;
                vm.keyword = $scope.keyword;
                vm.index = $scope.index;
                vm.totalPages = 0;

                if(vm.category === 'search'){
                    //watch change in $scope.keyword
                    $scope.$watch('keyword', (newvalue, oldvalue) => {
                        if(newvalue !== oldvalue) {
                            vm.keyword = $scope.keyword;
                            vm.pagination(1);
                        }
                    });
                }

                vm.pagination = (index) => {
                    vm.index = index;
                    // bind to rootscope categoryIndex
                    $scope.index = index;

                    if(vm.category !== 'search') {
                        var url = `/movies/category/${vm.category}/${vm.index}`;
                    }else{
                        //the movie component is for search
                        var url = `/movies/search/${vm.keyword}/${vm.index}`;
                    }

                    crud.GET(url, {}).then((response) => {
                        vm.movies = response.data;
                        vm.totalPages = response.data.total_pages;
                        $scope.$digest();
                        window.scrollTo(0, 0);
                        if(vm.category !== 'search') {
                            sessionStorage.setItem(vm.category, JSON.stringify(vm.movies));
                        }
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