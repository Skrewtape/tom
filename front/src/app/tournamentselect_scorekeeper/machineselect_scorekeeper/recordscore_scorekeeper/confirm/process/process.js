angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.final_score=$state.params.finalScore;
	$scope.team_id = $state.params.teamId;
	$scope.division_id=$state.params.divisionId;
	$scope.division_machine_id=$state.params.divisionMachineId;
	$scope.player_id = TimeoutResources.GetAllResources().player.player_id;
	
	if($scope.checkForBlankParams($scope.final_score) == true){
	    return;
	}
	$scope.division_promise = TimeoutResources.GetDivision(undefined,{division_id:$scope.division_id})
	$scope.tournament_promise = TimeoutResources.GetTournament($scope.division_promise,{tournament_id:TimeoutResources.GetTournamentIdFromDivision})
	if($scope.team_id.length > 0 ){
	    $scope.tournament_promise = TimeoutResources.GetTeam($scope.tournament_promise,{team_id:$scope.team_id});
	}
	//FIXME : in case of network problems, you can get into a situation where
	//        you can't complete a ticket - i.e. the score is entered, but the
	//        http connection times out.  Need to figure out a way to deal with this.	
	$scope.entry_id_promise = TimeoutResources.GetPlayerActiveEntry($scope.team_promise,
									{player_id:$scope.player_id,
									 division_id:$scope.division_id})
	$scope.score_promise = TimeoutResources.AddScore($scope.entry_id_promise,
							 {entry_id: TimeoutResources.GetEntryId,
							  division_machine_id:$scope.division_machine_id,
							  new_score:$scope.final_score})
	$scope.score_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    if($scope.resources.entry.scores.length >= $scope.resources.entry.number_of_scores_per_entry){
		$scope.complete = true;
	    } else {
		$scope.complete = false;
	    }
	})

	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
