angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.entry_id=$state.params.entryId;
	$scope.machines_promise = TimeoutResources.GetActiveMachines()
	$scope.entry_promise = TimeoutResources.GetEntry($scope.machines_promise,{entry_id:$scope.entry_id});	    	
	$scope.entry_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	})
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
