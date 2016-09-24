angular.module('app.player_see_queue.division_machines.queue',[/*REPLACEMECHILD*/]);
angular.module('app.player_see_queue.division_machines.queue').controller(
    'app.player_see_queue.division_machines.queue',
    function($scope, $state, StatusModal, TimeoutResources) {
        $scope.division_id = $state.params.divisionId;        
        $scope.division_machine_id = $state.params.divisionMachineId;        
        StatusModal.loading();
        $scope.division_machines_promise = TimeoutResources.GetAllDivisionMachines();
        TimeoutResources.GetDivisionQueue($scope.division_machines_promise,{division_id:$scope.division_id}).then(function(data){
            $scope.resources=TimeoutResources.GetAllResources();
            
            StatusModal.loaded();
        })        

	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});	    
    }
);
