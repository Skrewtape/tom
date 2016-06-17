angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {    
    $stateProvider.state(
        'app.tournamentselect_machine_add', {
            url: '/tournamentselect_machine_add',
            views: {
                '@': {
                    templateUrl: 'app/tournamentselect_machine_add/tournamentselect_machine_add.html',
                    controller: 'app.tournamentselect_machine_add',
                },
		'backbutton@app.tournamentselect_machine_add':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_machine_add':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
            }
	}).state(
        'app.tournamentselect_machine_add.machine_add', {
            url: '/machine_add/:divisionId',
            views: {
                '@': {
                    templateUrl: 'app/tournamentselect_machine_add/machine_add/machine_add.html',
                    controller: 'app.tournamentselect_machine_add.machine_add',
                },
		'backbutton@app.tournamentselect_machine_add.machine_add':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_machine_add.machine_add':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
            }
	})
});
