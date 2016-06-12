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
            'app.login', {
            url: '/login',
            views: {
                '@': {
                    templateUrl: 'app/login/login.html',
                    controller: 'app.login',
                }
            }
	}).state(            
            'app.playerlogin', {
            url: '/playerlogin',
            views: {
                '@': {
                    templateUrl: 'app/login/player_login.html',
                    controller: 'app.login',
                }
            }
	}).state(
	    //FIXME : move this to the login dir
            'app.about', {
            url: '/about',
            views: {
                '@': {
                    templateUrl: 'rev.html',
                }
            }
	})
});
