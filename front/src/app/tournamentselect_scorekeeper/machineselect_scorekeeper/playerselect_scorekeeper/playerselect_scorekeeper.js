angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper',
    function($scope, $state, StatusModal, TimeoutResources) {
	//FIXME : need to refactor the whole tree underneath so that it uses this the state param team_id
	$scope.division_machine_id = $state.params.divisionMachineId
	$scope.division_machine_promise = TimeoutResources.GetDivisionMachine(undefined,{division_machine_id:$scope.division_machine_id})
	$scope.division_machine_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	})
    }
);
