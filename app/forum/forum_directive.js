const _ = require('underscore');
const crud = require('../service/crud');
const util = require('../util/util');
const key = require('../util/properties').key;
const uuidv1 = require('uuid/v1');

export default (ngModule, firebase, database) => {
    ngModule.directive("forumInfo", () => {
        require('./forum_page.css');
        return {
            restrict: "E",
            scope: true,
            template: require('./forum_page.html'),
            controllerAs: "vm",
            controller: function ($scope, $rootScope, $mdDialog, $mdMedia) {
                const vm = this;
                vm.noContent = true;
                vm.showDraftForm = false;
                vm.draftPost = {};

                vm.load = () => {
                    vm.info = $rootScope.movieInfo;
                    if (vm.info && vm.info.id) {
                        database.ref(`/forum/${vm.info.id}`).once('value').then((snapshot) => {
                            if((snapshot.val() && snapshot.val().posts)){
                                vm.noContent = false;
                                vm.posts = snapshot.val().posts;
                                $scope.$digest();
                            }
                        });
                    }
                };

                vm.submitPost = () => {
                    let push = () => {
                        const user = firebase.auth().currentUser;
                        vm.draftPost.user = {};
                        vm.draftPost.email = user.email;
                        vm.draftPost.displayName = user.displayName;
                        vm.draftPost.photoURL = user.photoURL;
                        vm.draftPost.uid = user.uid;
                        database.ref(`/forum/${vm.info.id}/posts/`).push(vm.draftPost);
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('body')))
                                .clickOutsideToClose(true)
                                .title('Success')
                                .textContent('Posted successfully!')
                                .ok('Got it!')
                        );
                        vm.showDraftForm = false;
                        vm.load();
                    };

                    if (vm.draftPost && vm.draftPost.title && vm.draftPost.content) {
                        push();
                    }
                }

                vm.writePost = () => {
                    vm.showDraftForm = true;
                }

                vm.cancelPostDraft = () => {
                    vm.showDraftForm = false;
                }

                vm.load();
            }
        
    }});
};