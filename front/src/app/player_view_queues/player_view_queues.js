angular.module('app.player_view_queues',['app.player_view_queues.division_view',/*REPLACEMECHILD*/]);
angular.module('app.player_view_queues').controller(
    'app.player_view_queues',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.divisions_promise = TimeoutResources.GetAllDivisions();
        $scope.divisions_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });

	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});	    
    }
);
