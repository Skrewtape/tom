/*global angular, $, moment, app */
app.controller('TournamentDetailController', function(
	$scope, $http, $timeout, $modal, $state, Page) {
        $scope.data = {};

        Page.set_title('Tournament Detail');

        $http.get('[APIHOST]/tournament/' + $state.params.tournamentId).success(
            function(data) {
                $scope.data.tournament = data;

                Page.set_title('Tournament: ' + data.name);
            }
        );
        $scope.data.new_division = {};
        $scope.create_division = function() {
            if (!$scope.validData()) {
                return;
            }
            $scope.modal = {};
            var statusModal = $modal.open({
                templateUrl: 'modals/status.html',
                backdrop: 'static',
                keyboard: false,
                scope: $scope
            });
            $http.post(
                '[APIHOST]/tournament/' +
                    $scope.data.tournament.tournament_id +
                    '/division',
                $scope.data.new_division
            ).success(
                function(created) {
                    $scope.data.new_division = {};
                    $scope.data.tournament.divisions.push(created);
                    statusModal.close();
                }
            ).error(
                function(data) {
                    $scope.modal.message = 'Failed to create division!';
                    if (data && data.message) {
                        $scope.modal.message += ' : ' + data.message;
                    }
                }
            );
        };
        $scope.validData = function() {
            return $scope.data.new_division.name;
        };
    }
);
