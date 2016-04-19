angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state(
        'app', {
            url: '/app',
            views: {
                '@': {
                    templateUrl: 'app/home.html',
                    controller: 'IndexController',
                },
		'navbar_home': {
		    templateUrl: 'app/navbar_home.html',
		},
		'navbar': {
		    templateUrl: 'app/navbar.html',
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
