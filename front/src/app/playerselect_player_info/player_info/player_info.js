angular.module('app.playerselect_player_info.player_info',[/*REPLACEMECHILD*/]);
angular.module('app.playerselect_player_info.player_info').controller(
    'app.playerselect_player_info.player_info',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	StatusModal.loading();
        $scope.divisions_promise = TimeoutResources.GetActiveDivisions();
	$scope.metadivisions_promise = TimeoutResources.GetAllMetadivisions($scope.divisions_promise);
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.metadivisions_promise)
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.tournaments_promise,{player_id:$scope.player_id})	
	$scope.player_promise = TimeoutResources.GetPlayer($scope.player_teams_promise, {player_id:$scope.player_id})
	$scope.player_active_entries_count_promise = TimeoutResources.GetPlayerActiveEntriesCount($scope.player_promise,{player_id:$scope.player_id})
	$scope.player_tokens_promise = TimeoutResources.GetPlayerTokens($scope.player_active_entries_count_promise,{player_id:$scope.player_id});
	$scope.player_team_tokens_promise = TimeoutResources.GetPlayerTeamTokens($scope.player_tokens_promise,{player_id:$scope.player_id});	

	$scope.player_team_tokens_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    if($scope.resources.player_teams.teams.length>0){
		$scope.team_id = $scope.resources.player_teams.teams[0].team_id;
	    } else {
                $scope.team_id = undefined;
            }	    
	    StatusModal.loaded()
	})
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
