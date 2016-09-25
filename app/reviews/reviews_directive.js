const _ = require('underscore');
const crud = require('../service/crud');
const util = require('../util/util');
const key = require('../util/properties').key;

export default (ngModule) => {
    ngModule.directive("reviews", () => {
        require('./reviews.css');
        return {
            restrict: "E",
            scope: {
                id: "="
            },
            template: require('./reviews.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope) {
                const vm = this;

                vm.id = $scope.id;
                vm.reviews = [];
                vm.getReviews = () => {
                    crud.GET(`/movie/review/${vm.id}`, {}).then((response) => {
                        vm.reviews = response.data.results;
                        $scope.$digest();
                        console.log(vm.reviews);
                    }).catch((err) => {
                        console.error(err.data);
                    });
                };

                vm.getReviews();

                $scope.$watch('id', (newValue, oldValue) => {
                    vm.reviews = [];
                    vm.id = newValue;
                    vm.getReviews();
                });
            }
        }
    })
};