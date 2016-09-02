angular.module('app.remove_player.confirm',['app.remove_player.confirm.process',/*REPLACEMECHILD*/]);
angular.module('app.remove_player.confirm').controller(
    'app.remove_player.confirm',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
        StatusModal.loading();
	$scope.player_promise = TimeoutResources.GetPlayer(undefined, {player_id:$scope.player_id});
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.player_promise,{player_id:$scope.player_id});
        $scope.player_teams_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
	    if($scope.resources.player_teams.teams.length>0){
		$scope.team_id = $scope.resources.player_teams.teams[0].team_id;
	    } else {
                $scope.team_id = undefined;
            }	    
	    StatusModal.loaded();            
        });
    }
);
