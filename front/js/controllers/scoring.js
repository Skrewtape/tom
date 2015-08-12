/*global angular, $, moment, app, _ */
app.controller('ScoringController', function(
	$scope, $http, $timeout, $modal, $state, Page) {
        $scope.data = {};
        $scope.data.new_entry = {};
        $scope.data.free_entries = [];
        $scope.data.machine_map = {};
        $scope.data.scoring_queue = [];

        Page.set_title('Scoring');

        $http.get(
            '[APIHOST]/tournament/' + $state.params.tournamentId
        ).success(
            function(data) {
                $scope.data.tournament = data;
                $scope.data.new_entry.division = data.divisions[0];
                Page.set_title('Tournament: ' + data.name);
                _.each($scope.data.tournament.divisions, function(division) {
                    $http.get(
                        '[APIHOST]/division/' + division.division_id +
                        '/machine'
                    ).success(
                        function (data) {
                            $scope.data.machine_map[division.division_id] =
                                data.machines;
                        }
                    );
                });
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
        $http.get(
            '[APIHOST]/tournament/' + $state.params.tournamentId +
            '/entry/scoring'
        ).success(
            function(data) {
                $scope.data.scoring_queue = data.entries;
            }
        );
        $scope.spend_entry = function(entry_group, machine) {
            var entry_id = entry_group.entry_ids[0];
            $http.put(
                '[APIHOST]/entry/' + entry_id +
                '/machine/' + machine.machine_id
            ).success(
                function (created) {
                    for (var i = 0; i < $scope.data.free_entries.length; i++) {
                        var entry = $scope.data.free_entries[i];
                        if (created.entry_id == entry_id) {
                            $scope.data.free_entries.splice(i, 1);
                            break;
                        }
                    }
                    $scope.group_entries();
                    $scope.data.scoring_queue.push(created);
                }
            );
        };
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
                        entry.player.last_name + ' ' +
                        entry.player.first_name + ' ' +
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
                    last.entry_ids.push(entry.entry_id);
                }
                else {
                    $scope.data.grouped_free_entries.push({
                        player: entry.player,
                        division: entry.division,
                        entry_ids: [entry.entry_id]
                    });
                }
            });
        }
    }
);
