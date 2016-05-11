angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.entry_id=$state.params.entryId;
	$scope.complete_promise = TimeoutResources.CompleteEntry(undefined,{entry_id:$scope.entry_id})
	$scope.complete_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	})
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
