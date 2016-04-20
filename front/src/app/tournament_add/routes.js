angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {    
    $stateProvider.state(
        'app.tournament_add', {
            url: '/tournament_add',
            views: {
                '@': {
                    templateUrl: 'app/tournament_add/tournament_add.html',
                    controller: 'app.tournament_add',
                },
		'tournament_add_progress@app.tournament_add':{
                    templateUrl: 'app/tournament_add/tournament_add_progress.html',		    
		}
            }
	}).state(
        'app.tournament_add.process', {
            url: '/tournament_add/process',
            views: {
                '@': {
                    templateUrl: 'app/tournament_add/process/process.html',
                    controller: 'app.tournament_add.process',
                }
            },
	    params: {
		tournamentInfo: {}
	    }
	})
});
