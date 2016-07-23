export default (ngModule, firebase, database) => {
    ngModule.directive("mycollection", () => {
        require('./mycollection.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: true,
            template: require('./mycollection.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope, $location, $mdDialog) {
                const vm = this;
                vm.noContent = true;

                vm.forwardInfo = (info) => {
                    $rootScope.appName = info.title;
                    $rootScope.movieInfo = info;
                    $location.path('/main/info');
                };

                vm.removeItem = (key) => {
                    delete vm.collection[key];
                    var userId = firebase.auth().currentUser.uid;
                    if(userId) {
                        database.ref(`/users/${userId}/mycollection/${key}`).remove();
                    }else{
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('body')))
                                .clickOutsideToClose(true)
                                .title('Signin')
                                .textContent('Please signin first.')
                                .ok('Got it!')
                        );
                    }
                };

                var userId = firebase.auth().currentUser.uid;
                database.ref(`/users/${userId}`).once('value').then((snapshot) => {
                    if((snapshot.val() && snapshot.val().mycollection)){
                        vm.noContent = false;
                        vm.collection = snapshot.val().mycollection;
                        $scope.$digest();
                    }
                });
            }
        }
    })
}