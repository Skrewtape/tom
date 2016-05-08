angular.module('app.playerselect_player_info.player_info',[/*REPLACEMECHILD*/]);
angular.module('app.playerselect_player_info.player_info').controller(
    'app.playerselect_player_info.player_info',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	StatusModal.loading();
	$scope.player_promise = TimeoutResources.GetPlayer({player_id:$scope.player_id})
	$scope.player_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded()
	})
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
