/*global angular, app*/
app.controller('TournamentListController', function($scope, $http, $location, Page) {
	Page.set_title('Tournaments');
	$http.get('[APIHOST]/tournament').success(
		function(data) {
			$scope.data = data;
		}
	);
	$scope.openWork = function(tournamentId) {
		$location.path('tournaments/' + tournamentId);
	};
});
