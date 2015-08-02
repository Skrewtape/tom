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
            if (!$scope.valid_data()) {
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
        $scope.valid_data = function() {
            return $scope.data.new_division.name;
        };
        $scope.toggle_tournament = function() {
            if ($scope.data.tournament) {
                $http.put(
                    '[APIHOST]/tournament/' +
                    $state.params.tournamentId +
                    '/' +
                    ($scope.data.tournament.active ? "end" : "begin")
                ).success(
                    function() {
                        $scope.data.tournament.active =
                        !$scope.data.tournament.active;
                    }
                );
            }
        };
    }
);
