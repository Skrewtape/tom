angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	$scope.division_id = $state.params.divisionId;
	$scope.division_machine_id = $state.params.divisionMachineId;
	if($scope.checkForBlankParams($scope.player_id) == true){
	    return;
	}
	StatusModal.loading()
	$scope.division_promise = TimeoutResources.GetDivision(undefined,{division_id:$scope.division_id})
	$scope.tournament_promise = TimeoutResources.GetTournament($scope.division_promise,{tournament_id:TimeoutResources.GetTournamentIdFromDivision})
	$scope.player_promise = TimeoutResources.GetPlayer($scope.tournament_promise,{player_id:$scope.player_id});
	$scope.set_division_machine_player_promise = TimeoutResources.SetDivisionMachinePlayer($scope.player_promise,{player_id:$scope.player_id,division_machine_id:$scope.division_machine_id})
	$scope.team_promise = TimeoutResources.GetPlayerTeams($scope.set_division_machine_player_promise,{player_id:$scope.player_id})	
	$scope.team_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources()
	    console.log($scope.resources);
	    StatusModal.loaded()	
	})

	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
