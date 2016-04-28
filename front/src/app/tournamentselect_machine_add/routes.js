angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {    
    $stateProvider.state(
        'app.tournamentselect_machine_add', {
            url: '/tournament_edit',
            views: {
                '@': {
                    templateUrl: 'app/tournamentselect_machine_add/tournamentselect_machine_add.html',
                    controller: 'app.tournamentselect_machine_add',
                }
            }
	}).state(
        'app.tournamentselect_machine_add.machine_add', {
            url: '/tournamentselect_machine_add/machine_add/:tournamentName/:divisionId/:singleDivision',
            views: {
                '@': {
                    templateUrl: 'app/tournamentselect_machine_add/machine_add/machine_add.html',
                    controller: 'app.tournamentselect_machine_add.machine_add',
                }
            }
	})
});
