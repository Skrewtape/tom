/*global angular, $, moment, app */
app.controller('ScoringController', function(
	$scope, $http, $timeout, $modal, $state, Page) {
        $scope.data = {};
        $scope.data.new_entry = {};

        Page.set_title('Scoring');

        $http.get(
            '[APIHOST]/tournament/' + $state.params.tournamentId
        ).success(
            function(data) {
                $scope.data.tournament = data;
                $scope.data.new_entry.division = data.divisions[0];
                Page.set_title('Tournament: ' + data.name);
            }
        );
        $scope.player_search = function(substr) {
            return $http.get(
                '[APIHOST]/player/search', {
                    params: {
                        substring: substr
                    }
                }
            ).then(function(response) {
                return response.data.players;
            });
        };
        $scope.add_entry = function() {
            if (!$scope.valid_entry()) {
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
                '[APIHOST]/player/' +
                    $scope.data.new_entry_player.player_id +
                    '/machine',
                $scope.data.new_entry
            ).success(
                function(created) {
                    $scope.data.new_entry_player = null;
                    statusModal.close();
                }
            ).error(
                function(data) {
                    $scope.modal.message = 'Failed to add entry!';
                    if (data && data.message) {
                        $scope.modal.message += ' : ' + data.message;
                    }
                }
            );
        };
        $scope.valid_data = function() {
            return $scope.data.new_entry_player;
        };
    }
);
