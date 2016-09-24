angular.module('app.player_remove_queue.process',[/*REPLACEMECHILD*/]);
angular.module('app.player_remove_queue.process').controller(
    'app.player_remove_queue.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
        StatusModal.loading()
        TimeoutResources.RemovePlayerQueue(undefined,{player_id:$scope.player_id}).then(function(data){
            StatusModal.loaded();
        });
            

	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});	    
    }
);
