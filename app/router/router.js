export default ngModule => {
    ngModule.config(($stateProvider, $urlRouterProvider) => {
        $stateProvider.state(
            'main', {
                url: '/main',
                template: '<main></main>'
            }
        ).state(
            'main.tabs', {
                url: '/tabs',
                template: '<tabs></tabs>'
            }
        ).state(
            'main.info', {
                url: '/info',
                template: '<info></info>'
            }
        ).state(
            'main.signin', {
                url: '/signin',
                template: '<signin></signin>'
            }
        ).state(
            'main.register', {
                url: '/register',
                template: '<register></register>'
            }
        ).state(
            'main.search', {
                url: '/search',
                template: '<search></search>'
            }
        ).state(
            'main.mycollection', {
                url: '/mycollection',
                template: '<mycollection></mycollection>'
            }
        ).state(
            'main.newscontent', {
                url: '/newscontent',
                template: '<latest-news-content></latest-news-content>'
            }
        );

        $urlRouterProvider.otherwise('/main/tabs');
    });
};