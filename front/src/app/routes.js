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
		'backbutton@IndexController':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@IndexController':{
		templateUrl: 'shared_html/not_backbutton.html'
		}

            }
	}).state(            
            'app.login', {
            url: '/login',
            views: {
                '@': {
                    templateUrl: 'app/login/login.html',
                    controller: 'app.login',
                },
		'backbutton@app.login':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.login':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
            }
	}).state(            
            'app.playerlogin', {
            url: '/playerlogin',
            views: {
                '@': {
                    templateUrl: 'app/login/player_login.html',
                    controller: 'app.login',
                },
		'backbutton@app.login':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.login':{
		templateUrl: 'shared_html/not_backbutton.html'
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
