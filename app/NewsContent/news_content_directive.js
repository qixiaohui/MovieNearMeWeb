export default ngModule => {
    ngModule.directive("latestNewsContent", () => {
        require('./news_content.css');
        const crud = require('../service/crud');
        return {
            restrict: "E",
            scope: {},
            template: require('./news_content.html'),
            controllerAs: "vm",
            controller: function($scope, $rootScope, $location){
            	const vm = this;
            	vm.content = [];
            	var url = '';

        		const getContent = (url) => {
            		crud.GET(url, {}).then((response) => {
            			vm.content = response.data.article;
            			$scope.$digest();
            		}).catch((err) =>{
            			console.error(err.message);
            		});
            	}

            	if($rootScope.news) {
            		vm.news = $rootScope.news;
            		let titleList = vm.news.content.substring(0, vm.news.content.length-1).split("/");
        			let title = titleList[titleList.length-1];
            		url = `/news/content/${title}`;
            		getContent(url);
            	}
            }
        }
    })
}