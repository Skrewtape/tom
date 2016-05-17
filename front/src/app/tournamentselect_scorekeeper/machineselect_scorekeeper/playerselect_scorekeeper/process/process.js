angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	$scope.team=$state.params.team;
	$scope.division_id = $state.params.divisionId;
	$scope.division_machine_id = $state.params.divisionMachineId;
	//$scope.tournament_id = $state.params.tournamentId	
	$scope.team_tournament = $state.params.teamTournament;
	if($scope.checkForBlankParams($scope.player_id) == true){
	    return;
	}
	
	StatusModal.loading()
	//$scope.tournament_promise = TimeoutResources.GetTournament($scope.division_promise,{tournament_id:$scope.tournament_id})
	$scope.player_promise = TimeoutResources.GetPlayer($scope.tournament_promise,{player_id:$scope.player_id});
	//$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.player_promise,{player_id:$scope.player_id});
	console.log($scope.team_tournament);
	if($scope.team_tournament == "false"){
	    $scope.set_division_machine_promise = TimeoutResources.SetDivisionMachinePlayer($scope.player_promise,{player_id:$scope.player_id,division_machine_id:$scope.division_machine_id})
	}
	if($scope.team_tournament == "true"){
	    $scope.set_division_machine_promise = TimeoutResources.SetDivisionMachineTeam($scope.player_promise,{team_id:$scope.team.team_id,division_machine_id:$scope.division_machine_id})
	}
	$scope.set_division_machine_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources()	    
	    StatusModal.loaded()
	})

	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
