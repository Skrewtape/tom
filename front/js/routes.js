/*global app*/
app.config(function($routeProvider){
	$routeProvider.when(
		'/tournaments', {
			templateUrl: 'tournament_list.html',
			controller: 'TournamentListController',
		}
	).when(
		'/tournaments/:tournamentId', {
			templateUrl: 'tournament.html',
			controller: 'TournamentDetailController',
		}
	).when(
		'/create_tournament', {
			templateUrl: 'create_tournament.html',
			controller: 'CreateTournamentController',
		}
	).otherwise({
		redirectTo: '/tournaments',
	});
});
