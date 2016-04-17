app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    
    $stateProvider.state(
        'home', {
            url: '/',
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
        'home.login', {
            url: 'login',
            views: {
                '@': {
                    templateUrl: 'app/login.html',
                    controller: 'LoginController',
                }
            }
	})
});
