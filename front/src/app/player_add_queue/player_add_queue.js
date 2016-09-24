angular.module('app.player_add_queue',['app.player_add_queue.division_machines',/*REPLACEMECHILD*/]);
angular.module('app.player_add_queue').controller(
    'app.player_add_queue',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
        StatusModal.loading();
	$scope.queue_promise = TimeoutResources.GetPlayerQueue(undefined,{player_id:$scope.player_id});
	$scope.divisions_promise = TimeoutResources.GetAllDivisions($scope.queue_promise);
        $scope.divisions_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
    }
);
