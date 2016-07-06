export default ngModule => {
    ngModule.config(($stateProvider, $urlRouterProvider) => {
        $stateProvider.state(
            'movies', {
                url: '/movies',
                template: '<main></main>'
            }
        );

        $urlRouterProvider.otherwise('/movies');
    });
};