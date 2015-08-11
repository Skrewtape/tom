/*global angular, $, moment, app, _ */
app.controller('ScoringController', function(
	$scope, $http, $timeout, $modal, $state, Page) {
        $scope.data = {};
        $scope.data.new_entry = {};
        $scope.data.free_entries = [];

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
        $http.get(
            '[APIHOST]/tournament/' + $state.params.tournamentId +
            '/entry/free'
        ).success(
            function(data) {
                $scope.data.free_entries = data.entries;
                $scope.group_entries();
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
                    $scope.data.new_entry.player.player_id +
                    '/entry',
                {
                    division_id: $scope.data.new_entry.division.division_id
                }
            ).success(
                function(created) {
                    $scope.data.free_entries.push(created);
                    $scope.group_entries();
                    $scope.data.new_entry.player = null;
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
        $scope.valid_entry = function() {
            return $scope.data.new_entry.player &&
                $scope.data.new_entry.player.player_id;
        };

        $scope.group_entries = function() {
            $scope.data.grouped_free_entries = [];
            _.each(_.sortBy(
                $scope.data.free_entries, function (entry) {
                    return (
                        entry.player.last_name +
                        entry.player.first_name +
                        entry.division.name
                    );
                }
            ), function(entry) {
                var len = $scope.data.grouped_free_entries.length;
                var last;
                if (len) {
                    last = $scope.data.grouped_free_entries[len - 1];
                }
                if (last && (
                        last.player.player_id == entry.player.player_id
                    ) && (
                        last.division.division_id == entry.division.division_id
                    )
                ) {
                    last.count++;
                }
                else {
                    $scope.data.grouped_free_entries.push({
                        player: entry.player,
                        division: entry.division,
                        count: 1
                    });
                }
            });
        }
    }
);
