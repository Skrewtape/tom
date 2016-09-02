angular.module('app.remove_player.confirm.process',[/*REPLACEMECHILD*/]);
angular.module('app.remove_player.confirm.process').controller(
    'app.remove_player.confirm.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
        StatusModal.loading();
        //FIXME : This will silently fail if the player is not playing a game - it should properly alert the user.
	TimeoutResources.GetPlayer(undefined, {player_id:$scope.player_id}).then(function(data){           
            player = TimeoutResources.GetAllResources()['player'];
            if(player.division_machine != undefined){
                division_machine_id = player.division_machine.division_machine_id;                
                return TimeoutResources.ClearDivisionMachinePlayer(undefined,
                                                                   {division_machine_id:division_machine_id,
                                                                    player_id:$scope.player_id});                
            } 
        }).then(function(data){            
            StatusModal.loaded();
            $scope.resources = TimeoutResources.GetAllResources();            
        });
	// #$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.player_promise,{player_id:$scope.player_id});
        // $scope.player_promise.then(function(data){
        //     if($scope.team_id != undefined){
        //         $scope.team_promise = TimeoutResources.GetTeam(undefined,{team_id:$scope.team_id});
        //     }
        //     if($scope.resources.player.division_machine != undefined){
        //         division_machine_id = $scope.resources.player.division_machine.division_machine_id;
        //     } else {
        //         division_machine_id = -1;
        //     }
        //     clear_player_promise = TimeoutResources.ClearDivisionMachinePlayer(undefined,
        //                                                                                {division_machine_id:division_machine_id,
        //                                                                                 player_id:$scope.player_id});
        //     clear_player_promise.then(function(data){
        //         $scope.resources = TimeoutResources.GetAllResources();                
	//         StatusModal.loaded();                
        //     });
            
        // });
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});	    
    }
);
