angular.module('app.player_view_queues.division_view',[/*REPLACEMECHILD*/]);
angular.module('app.player_view_queues.division_view').controller(
    'app.player_view_queues.division_view',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.division_id=$state.params.division_id;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
        StatusModal.loading();
        $scope.queue_promise = TimeoutResources.GetDivisionQueue(undefined,{division_id:$scope.division_id});
        $scope.division_promise = TimeoutResources.GetDivision($scope.queue_promise,{division_id:$scope.division_id});
        $scope.division_promise.then(function(data){            
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();          
        })

	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});	    
    }
);
