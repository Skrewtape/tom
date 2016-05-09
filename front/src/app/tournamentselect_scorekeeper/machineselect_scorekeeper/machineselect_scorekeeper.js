angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper','app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper',    
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.division_id=$state.params.divisionId;
	StatusModal.loading();
	//$scope.machines_promise = TimeoutResources.GetActiveMachines();
	$scope.division_promise = TimeoutResources.GetDivision(undefined,{division_id:$scope.division_id});
	
	$scope.division_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();
	    console.log($scope.resources.division)
	});
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
