/*global angular, $, moment, app, _ */
app.controller('TournamentStatsController', function(
	$scope, $http, $timeout, $modal, $state, Page) {
        $scope.data = {};
        $scope.data.high_scores = {};

        Page.set_title('Stats');

        $http.get(
            '[APIHOST]/tournament/' + $state.params.tournamentId
        ).success(
            function(data) {
                $scope.data.tournament = data;
                Page.set_title(data.name + ' stats');
            }
        );
        $http.get(
            '[APIHOST]/tournament/' + $state.params.tournamentId +
            '/entry/scored'
        ).success(
            function(data) {
                var high_scores = {};
                _.each(data.entries, function(entry) {
                    var existing = high_scores[
                        entry.division.division_id
                    ];
                    if (!existing) {
                        existing = high_scores[
                            entry.division.division_id
                        ] = [];
                    }
                    var found = false;
                    for (var i = 0; i < existing.length; i++) {
                        if (
                            existing[i].machine.machine_id ==
                            entry.machine.machine_id
                        ) {
                            found = true;
                            if (existing[i].score < entry.score) {
                                existing[i] = entry;
                            }
                            break;
                        }
                    }
                    if (!found) {
                        existing.push(entry);
                    }
                });
                $scope.data.high_scores = high_scores;
            }
        );
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
