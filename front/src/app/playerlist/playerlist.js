angular.module('app.playerlist',[/*REPLACEMECHILD*/]);
angular.module('app.playerlist').controller(
    'app.playerlist',
    function($scope, $state, StatusModal, TimeoutResources) {
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	StatusModal.loading()
	$scope.players_promise = TimeoutResources.GetAllPlayers();
	$scope.players_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded()
	})
    }
);
