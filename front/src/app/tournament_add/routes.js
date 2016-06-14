angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {    
    $stateProvider.state(
	//killroy was here
        'app.tournament_add', {
            url: '/tournament_add',
            views: {
                '@': {
                    templateUrl: 'app/tournament_add/tournament_add.html',
                    controller: 'app.tournament_add',
                },
		'tournament_add_progress@app.tournament_add':{
                    templateUrl: 'app/tournament_add/tournament_add_progress.html',		    
		},
                'division_config_params@app.tournament_add':{
                    templateUrl: 'shared_html/division_config_params.html',		    
		}                
            }
	}).state(
	//killroy was here	    
        'app.tournament_add.process', {
            url: '/process',
            views: {
                '@': {
                    templateUrl: 'app/tournament_add/process/process.html',
                    controller: 'app.tournament_add.process',
                },
		'tournament_add_progress@app.tournament_add.process':{
                    templateUrl: 'app/tournament_add/tournament_add_progress.html',		    
		}

            },
	    params: {
		tournamentInfo: {}
	    }
	}).state(
        //killroy was here
        'app.tournament_add.process.division_add', {
            url: '/division_add/:tournamentId',
            views: {
                '@': {
                    templateUrl: 'app/tournament_add/process/division_add/division_add.html',
                    controller: 'app.tournament_add.process.division_add',
                },
		'tournament_add_progress@app.tournament_add.process.division_add':{
                    templateUrl: 'app/tournament_add/tournament_add_progress.html',		    
		},
                'division_config_params@app.tournament_add.process.division_add':{
                    templateUrl: 'shared_html/division_config_params.html',		    
		}
            }
	})
});
