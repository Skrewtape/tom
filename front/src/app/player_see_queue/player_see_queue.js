angular.module('app.player_see_queue',['app.player_see_queue.division_machines',/*REPLACEMECHILD*/]);
angular.module('app.player_see_queue').controller(
    'app.player_see_queue',
    function($scope, $state, StatusModal, TimeoutResources) {
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});
	$scope.divisions_promise = TimeoutResources.GetAllDivisions();
        $scope.divisions_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
        
    }
);
