angular.module('app.player_add_queue.division_machines.confirm',['app.player_add_queue.division_machines.confirm.process',/*REPLACEMECHILD*/]);
angular.module('app.player_add_queue.division_machines.confirm').controller(
    'app.player_add_queue.division_machines.confirm',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.division_machine_id=$state.params.divisionMachineId;
	$scope.division_id=$state.params.divisionId;        
	$scope.player_id=$state.params.playerId;

	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});
        StatusModal.loading();
        $scope.division_machines_promise = TimeoutResources.GetAllDivisionMachines();
        $scope.player_tokens_promise = TimeoutResources.GetPlayerTokens($scope.division_machines_promise,{player_id:$scope.player_id});
        $scope.queue_promise = TimeoutResources.GetPlayerQueue($scope.division_machines_promise,{player_id:$scope.player_id});
        $scope.division_machine_promise = TimeoutResources.GetDivisionMachine($scope.player_tokens_promise,{division_machine_id:$scope.division_machine_id});        
        $scope.division_machine_promise.then(function(data){
            $scope.resources=TimeoutResources.GetAllResources();
            StatusModal.loaded();
        })
        
    }
);
