angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state(
        'app', {
            url: '/app',
            views: {
                '@': {
                    templateUrl: 'app/home.html',
                    controller: 'IndexController',
                }

            }
	}).state(
	    //FIXME : move this to the login dir
            'app.login', {
            url: '/login',
            views: {
                '@': {
                    templateUrl: 'app/login/login.html',
                    controller: 'app.login',
                }
            }
	})
});
