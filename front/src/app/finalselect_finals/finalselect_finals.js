angular.module('app.finalselect_finals',['app.finalselect_finals.matchselect_finals',/*REPLACEMECHILD*/]);
angular.module('app.finalselect_finals').controller(
    'app.finalselect_finals',
    function($scope, $state, StatusModal, TimeoutResources) {
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	StatusModal.loading()
	$scope.promise = TimeoutResources.GetFinals();
	//$scope.finals_promise = TimeoutResources.GetTournament($scope.promise);
        $scope.divisions_promise = TimeoutResources.GetAllDivisions($scope.promise);
	$scope.divisions_promise.then(function(data){
	    StatusModal.loaded();
	    $scope.resources = TimeoutResources.GetAllResources();	    
	})
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
