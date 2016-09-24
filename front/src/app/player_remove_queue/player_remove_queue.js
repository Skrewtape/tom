angular.module('app.player_remove_queue',['app.player_remove_queue.process',/*REPLACEMECHILD*/]);
angular.module('app.player_remove_queue').controller(
    'app.player_remove_queue',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
        StatusModal.loading();
        $scope.machine_promise = TimeoutResources.GetAllDivisionMachines();        
	$scope.queue_promise = TimeoutResources.GetPlayerQueue($scope.machine_promise,{player_id:$scope.player_id});
        $scope.queue_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            console.log($scope.resources.machines);
            StatusModal.loaded();
        });
    }
);
