const _ = require('underscore');

export default ngModule => {
    ngModule.directive("info", () => {
        require('./movie_info.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: true,
            template: require('./movie_info.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope) {
                const vm = this;
                vm.info = $rootScope.movieInfo;

                crud.GET(`/movie/info/${vm.info.id}`, {}).then((response) => {
                    _.extend(vm.info, response.data);
                    $scope.$digest();
                }).catch((err) => {
                    console.error(err);
                });

                crud.GET(`/movie/similar/${vm.info.id}`, {}).then((response) => {
                    vm.info.similar = response.data.results;
                    $scope.$digest();
                }).catch((err) => {
                    console.error(err);
                });

                crud.GET(`/movie/video/${vm.info.title}`, {}).then((response) => {
                    vm.info.videos = response.data;
                    $scope.$digest();
                }).catch((err) => {
                    vm.info.videos = [];
                    $scope.$digest();
                });

                vm.openPlayer = (url) => {
                    window.open(url,'_blank');
                };
            }
        }
    });
}