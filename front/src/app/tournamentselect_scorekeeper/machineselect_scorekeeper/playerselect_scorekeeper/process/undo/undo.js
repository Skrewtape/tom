angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	$scope.division_machine_id = $state.params.divisionMachineId;	
	if($scope.checkForBlankParams($scope.player_id) == true){
	    return;
	}
	StatusModal.loading()
	$scope.clear_division_machine_player_promise = TimeoutResources.ClearDivisionMachinePlayer(undefined,
												   {player_id:$scope.player_id,
												    division_machine_id:$scope.division_machine_id})
	
	$scope.clear_division_machine_player_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();
	})


	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
