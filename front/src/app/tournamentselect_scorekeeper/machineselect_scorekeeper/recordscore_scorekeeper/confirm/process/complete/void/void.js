angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.void',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.void').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.void',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.entry_id = $state.params.entryId;
	if($scope.checkForBlankParams($scope.entry_id) == true){
	    return;
	}
	$scope.void_promise = TimeoutResources.VoidEntry(undefined,{entry_id:$scope.entry_id})
	$scope.void_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	})
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
