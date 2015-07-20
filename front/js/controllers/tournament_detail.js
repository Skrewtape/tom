/*global angular, $, moment, app */
app.controller('TournamentDetailController', function(
	$scope, $http, $timeout, $modal, $routeParams, Page
) {
    $scope.data = {};

	Page.set_title('Tournament Detail');

	$http.get('[APIHOST]/tournament/' + $routeParams.tournamentId).success(
		function(data) {
			$scope.data = {};
			$scope.data.tournament = data;

            Page.set_title('Tournament: ' + data.name);
		}
	);
});
