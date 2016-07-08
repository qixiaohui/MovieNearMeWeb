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
        );

        $urlRouterProvider.otherwise('/main/tabs');
    });
};