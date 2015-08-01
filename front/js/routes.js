/*global app*/
app.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');

	$stateProvider.state(
		'home', {
            url: '/',
			templateUrl: 'home.html',
			controller: 'HomeController',
            ncyBreadcrumb: {
                label: 'Home',
            },
		}
	).state(
        'home.tournament', {
            url: 'tournaments/:tournamentId',
            views: {
                '@': {
                    templateUrl: 'tournament.html',
                    controller: 'TournamentDetailController',
                }
            },
            ncyBreadcrumb: {
                label: '{{data.tournament.name}}',
            },
		}
	).state(
        'home.tournament.division', {
            url: '/divisions/:divisionId',
            views: {
                '@': {
                    templateUrl: 'division.html',
                    controller: 'DivisionDetailController',
                }
            },
            ncyBreadcrumb: {
                label: '{{data.division.name}}',
            },
		}
	)
});
