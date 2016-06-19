angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process','app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.void',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete',
    function($scope, $state, StatusModal, TimeoutResources) {
        $scope.entry_id=$state.params.entryId;
        $scope.team_tournament = $state.params.teamTournament;
        $scope.player_id = $state.params.playerId;
	$scope.team_id = $state.params.teamId;
        
	StatusModal.loading();
        if($scope.team_tournament == "false"){
	    $scope.whatever_is_player_promise = TimeoutResources.GetPlayer($scope.division_machine_promise,{player_id:$scope.player_id});	    
        } else {
	    $scope.whatever_is_playing_promise = TimeoutResources.GetTeam($scope.division_machine_promise,{team_id:$scope.team_id});	    
	}
        $scope.entry_promise = TimeoutResources.GetEntry(undefined,{entry_id:$scope.entry_id});
	$scope.machines_promise = TimeoutResources.GetActiveMachines($scope.entry_promise);
	$scope.entry_promise = TimeoutResources.GetEntry($scope.machines_promise,{entry_id:$scope.entry_id});	    	
	$scope.entry_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
            //GUYH - massive hack - Void function in status_modal expects scope.resources.active_entry
            $scope.resources.active_entry={entry:$scope.resources.entry};
	    StatusModal.loaded();
	})
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
        }
);
