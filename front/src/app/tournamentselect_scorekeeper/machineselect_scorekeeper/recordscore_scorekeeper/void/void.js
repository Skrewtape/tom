angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.entry_id = $state.params.entryId;
	if($scope.checkForBlankParams($scope.entry_id) == true){
	    return;
	}
	$scope.void_promise = TimeoutResources.VoidEntry(undefined,{entry_id:$scope.entry_id})
	$scope.void_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	})        
    }
);
