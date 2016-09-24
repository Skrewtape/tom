angular.module('app.player_add_queue.division_machines.confirm.process',[/*REPLACEMECHILD*/]);
angular.module('app.player_add_queue.division_machines.confirm.process').controller(
    'app.player_add_queue.division_machines.confirm.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.dummy=$state.params.dummy;
	$scope.player_id=$state.params.playerId;
	$scope.division_machine_id=$state.params.divisionMachineId;

        
	if($scope.checkForBlankParams($scope.dummy) == true){
	    return;
	}
        StatusModal.loading();
	$scope.queue_promise = TimeoutResources.AddPlayerQueue(undefined,{player_id:$scope.player_id,division_machine_id:$scope.division_machine_id});
        $scope.queue_promise.then(function(data){
            StatusModal.loaded();
        })
    }
);
