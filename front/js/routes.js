/*global app*/
app.config(function($routeProvider){
	$routeProvider.when(
		'/', {
			templateUrl: 'home.html',
			controller: 'HomeController',
		}
	).when(
		'/tournaments/:tournamentId', {
			templateUrl: 'tournament.html',
			controller: 'TournamentDetailController',
		}
	).when(
		'/divisions/:divisionId', {
			templateUrl: 'division.html',
			controller: 'DivisionDetailController',
		}
	).when(
		'/create_tournament', {
			templateUrl: 'create_tournament.html',
			controller: 'CreateTournamentController',
		}
	).otherwise({
		redirectTo: '/',
	});
});
