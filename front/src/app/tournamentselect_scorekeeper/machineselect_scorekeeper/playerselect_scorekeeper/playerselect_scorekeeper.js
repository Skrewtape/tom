angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.division_machine_id = $state.params.divisionMachineId
	$scope.machines_promise = TimeoutResources.GetActiveMachines()
	$scope.machines_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	})
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
