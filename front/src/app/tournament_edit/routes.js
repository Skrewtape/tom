angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {    
    $stateProvider.state(
        'app.tournament_edit', {
            url: '/tournament_edit',
            views: {
                '@': {
                    templateUrl: 'app/tournament_edit/tournament_edit.html',
                    controller: 'app.tournament_edit',
                }
            }
	}).state(
        'app.tournament_edit.machine_add', {
            url: '/tournament_edit/machine_add/:tournamentName/:divisionId/:singleDivision',
            views: {
                '@': {
                    templateUrl: 'app/tournament_edit/machine_add/machine_add.html',
                    controller: 'app.tournament_edit.machine_add',
                }
            }
	})
});
