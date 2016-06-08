angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process',
    function($scope, $state, StatusModal, TimeoutResources) {
        $scope.team_tournament = $state.params.teamTournament;
        $scope.player_id=$state.params.playerId;
        $scope.team_id=$state.params.teamId;
	$scope.entry_id=$state.params.entryId;        
        $scope.asshole = $state.params.asshole;
        $scope.division_machine_id = $state.params.divisionMachineId;
	if($scope.checkForBlankParams($scope.asshole) == true){
	    return;
	}
        StatusModal.loading();
        if($scope.team_tournament=="true"){
            $scope.team_promise = TimeoutResources.GetTeam(undefined,{team_id:$scope.team_id},{/*post_data*/});
        }
            
        $scope.asshole_promise = TimeoutResources.PlayerIsAsshole(undefined,{division_machine_id:$scope.division_machine_id, entry_id:$scope.entry_id},{/*post_data*/});
        $scope.asshole_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
    }
);
