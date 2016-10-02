export default ngModule => {
    ngModule.directive("latestNews", () => {
        require('./news.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: {},
            template: require('./news.html'),
            controllerAs: "vm",
            controller: function($scope, $rootScope, $location){
                const vm = this;
                vm.news = [];
                vm.getLatestNews = (index) => {
                    let url = `/news/latest/${index}`;
                    crud.GET(url, {}).then((response) => {
                        vm.news = response.data.list;
                        $scope.$digest();
                    }).catch((err) => {
                        console.error(err.message);
                    });
                }

                vm.newsContent = (news) => {
                    $rootScope.news = news;
                    $rootScope.appName = "Latest News";
                    $location.path('/main/newscontent');
                }

                vm.getLatestNews(1);
            }
        }
    })
}