angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {    
    $stateProvider.state(
        'app.tournamentselect_machine_add', {
            url: '/tournamentselect_machine_add',
            views: {
                '@': {
                    templateUrl: 'app/tournamentselect_machine_add/tournamentselect_machine_add.html',
                    controller: 'app.tournamentselect_machine_add',
                }
            }
	}).state(
        'app.tournamentselect_machine_add.machine_add', {
            url: '/machine_add/:divisionId',
            views: {
                '@': {
                    templateUrl: 'app/tournamentselect_machine_add/machine_add/machine_add.html',
                    controller: 'app.tournamentselect_machine_add.machine_add',
                }
            }
	})
});
