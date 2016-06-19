angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.final_score=$state.params.finalScore;
        $scope.team_id = $state.params.teamId;
        $scope.tournament_id = $state.params.tournamentId;
	$scope.division_id=$state.params.divisionId;        
	$scope.division_machine_id=$state.params.divisionMachineId;
	$scope.player_id = $state.params.playerId;
	$scope.team_tournament = $state.params.teamTournament;
	$scope.entry_id = $state.params.entryId;
        
	if($scope.checkForBlankParams($scope.final_score) == true){
	    return;
	}
	StatusModal.loading();
	//FIXME : in case of network problems, you can get into a situation where
	//        you can't complete a ticket - i.e. the score is entered, but the
	//        http connection times out.  Need to figure out a way to deal with this.
        console.log($scope.entry_id+ ' is entry id');
        $scope.tournament_promise = TimeoutResources.GetTournament(undefined,{tournament_id:$scope.tournament_id});
	if($scope.team_tournament == "false"){
	    
	    $scope.player_promise = TimeoutResources.GetPlayer($scope.tournament_promise,{player_id:$scope.player_id});	    	    
	    $scope.score_promise = TimeoutResources.AddScore($scope.entry_promise,
							     {entry_id: $scope.entry_id,
							      division_machine_id:$scope.division_machine_id,
							      new_score:$scope.final_score});
	} else {
	    $scope.team_promise = TimeoutResources.GetTeam($scope.tournament_promise,{team_id:$scope.team_id});
	    $scope.score_promise = TimeoutResources.AddScore($scope.entry_promise,
							     {entry_id: $scope.entry_id,
							      division_machine_id:$scope.division_machine_id,
							      new_score:$scope.final_score});
	}
	$scope.entry_promise = TimeoutResources.GetEntry($scope.score_promise,{entry_id:$scope.entry_id});            
        
	$scope.entry_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    // if($scope.team_tournament == "true"){                
	    //     $scope.entry_id = $scope.resources.team_active_entry.entry.entry_id;
	    // } else {
	    //     $scope.entry_id = $scope.resources.player_active_entry.entry.entry_id;		
	    // }
            $scope.entry_id = $scope.resources.entry.entry_id;            
	    if($scope.resources.entry.scores.length >= $scope.resources.entry.number_of_scores_per_entry){
		$scope.complete = true;
	    } else {
		$scope.complete = false;
	    }
	    StatusModal.loaded();
	});        
    }
);
