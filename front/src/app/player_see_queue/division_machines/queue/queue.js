angular.module('app.player_see_queue.division_machines.queue',[/*REPLACEMECHILD*/]);
angular.module('app.player_see_queue.division_machines.queue').controller(
    'app.player_see_queue.division_machines.queue',
    function($scope, $state, StatusModal, TimeoutResources, $interval) {
        $scope.division_id = $state.params.divisionId;        
        $scope.division_machine_id = $state.params.divisionMachineId;        
        $scope.wait_till_next_reload=0;
        $scope.countdown=100;
        StatusModal.loading();
        $scope.division_machines_promise = TimeoutResources.GetAllDivisionMachines();
        TimeoutResources.GetDivisionQueue($scope.division_machines_promise,{division_id:$scope.division_id}).then(function(data){
            $scope.resources=TimeoutResources.GetAllResources();            
            StatusModal.loaded();
            
            $scope.stop = $interval(function() {            
                if ($state.is('app.player_see_queue.division_machines.queue') == false){
                    $interval.cancel($scope.stop);
                    return;
                }                
                $scope.wait_till_next_reload=$scope.wait_till_next_reload+1;
                if($scope.wait_till_next_reload <= 150){                    
                    $scope.countdown = $scope.countdown - .65;
                    return;
                }
                $scope.wait_till_next_reload = 0;                
                StatusModal.loading();
                $scope.division_machines_promise = TimeoutResources.GetAllDivisionMachines();
                TimeoutResources.GetDivisionQueue($scope.division_machines_promise,{division_id:$scope.division_id}).then(function(data){
                    $scope.resources=TimeoutResources.GetAllResources();                
                    StatusModal.loaded();
                    $scope.countdown=100;
                });                                
            },100);
        })        

	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});	    
    }
);
