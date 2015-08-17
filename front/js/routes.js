/*global app*/
app.config(function($stateProvider, $urlRouterProvider) {
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
	).state(
        'home.scoring', {
            url: 'scoring/:tournamentId',
            views: {
                '@': {
                    templateUrl: 'scoring.html',
                    controller: 'ScoringController',
                }
            },
            ncyBreadcrumb: {
                label: 'Scoring {{data.tournament.name}}',
            },
		}
	).state(
        'home.stats', {
            url: 'stats/:tournamentId',
            views: {
                '@': {
                    templateUrl: 'stats.html',
                    controller: 'TournamentStatsController',
                }
            },
            ncyBreadcrumb: {
                label: '{{data.tournament.name}} Stats',
            },
		}
	)
});
