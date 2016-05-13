angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.entry_id=$state.params.entryId;
	$scope.player_id=$state.params.playerId;
	$scope.division_id=$state.params.divisionId;
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams(undefined,{player_id:$scope.player_id})
	$scope.division_promise = TimeoutResources.GetDivision($scope.player_teams_promise,{division_id:$scope.division_id})
	$scope.tournament_promise = TimeoutResources.GetTournament($scope.division_promise,{tournament_id:TimeoutResources.GetTournamentIdFromDivision})
	$scope.complete_promise = TimeoutResources.CompleteEntry($scope.tournament_promise,{entry_id:$scope.entry_id})
	$scope.complete_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	})
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
