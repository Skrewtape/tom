angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.entry_id=$state.params.entryId;
	$scope.player_id=$state.params.playerId;
	$scope.division_id=$state.params.divisionId;
	$scope.tournament_id=$state.params.tournamentId;
	$scope.team_id=$state.params.teamId;
	$scope.team_tournament = $state.params.teamTournament;
	StatusModal.loading()
	//FIXME : GUYH - need to embed an actual "is this a team tournament" in the state params
	if($scope.team_tournament=="false"){
	    $scope.player_team_promise = TimeoutResources.GetPlayer(undefined,{player_id:$scope.player_id})
	} else {
	    $scope.player_team_promise = TimeoutResources.GetTeam(undefined,{team_id:$scope.team_id})
	}
	//$scope.tournament_promise = TimeoutResources.GetTournament($scope.player_team_promise,{tournament_id:$scope.tournament_id})
	$scope.complete_promise = TimeoutResources.CompleteEntry($scope.player_team_promise,{entry_id:$scope.entry_id})
	$scope.complete_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded()
	})
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
