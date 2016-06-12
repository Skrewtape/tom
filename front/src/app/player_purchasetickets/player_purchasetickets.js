angular.module('app.player_purchasetickets',['app.player_purchasetickets.process',/*REPLACEMECHILD*/]);
angular.module('app.player_purchasetickets').controller(
    'app.player_purchasetickets',
    function($scope, $state, StatusModal, TimeoutResources,Page) {
        $scope.player_id = $state.params.playerId;
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	$scope.player_promise = TimeoutResources.GetPlayer(undefined,{player_id:$scope.player_id});
        $scope.player_promise.then(function(data){            
            $scope.resources = TimeoutResources.GetAllResources();
        });
    }
);
