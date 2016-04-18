app.config(function($stateProvider, $urlRouterProvider) {
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
