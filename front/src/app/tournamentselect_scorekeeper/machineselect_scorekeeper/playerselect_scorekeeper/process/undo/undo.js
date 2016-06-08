angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo',
    function($scope, $state, StatusModal, TimeoutResources) {
        $scope.player_id=$state.params.playerId;
	$scope.team_id=$state.params.teamId;        
	$scope.team_tournament = $state.params.teamTournament;
	$scope.division_machine_id = $state.params.divisionMachineId;	
	if($scope.checkForBlankParams($scope.player_id) == true){
	    return;
	}
	StatusModal.loading();
	if($scope.team_tournament == "false"){        
	    $scope.clear_division_machine_player_promise = TimeoutResources.ClearDivisionMachinePlayer(undefined,
												       {player_id:$scope.player_id,
												        division_machine_id:$scope.division_machine_id});
	}
        if($scope.team_tournament == "true"){
	    $scope.clear_division_machine_player_promise = TimeoutResources.ClearDivisionMachineTeam(undefined,
												     {team_id:$scope.team_id,
												      division_machine_id:$scope.division_machine_id});                        
        }
	$scope.clear_division_machine_player_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();
	});
    }
);
