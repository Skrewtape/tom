angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {    
    $stateProvider.state(
        'app.tournament_add', {
            url: '/tournament_add',
            views: {
                '@': {
                    templateUrl: 'app/tournament_add/tournament_add.html',
                    controller: 'app.tournament_add',
                }
            }
	})
});
