angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.division_machine_id = $state.params.divisionMachineId;
        $scope.score=$state.params.score;        
        StatusModal.loading();
        $scope.division_machine_promise = TimeoutResources.GetDivisionMachine($scope.machines_promise,{division_machine_id:$scope.division_machine_id});        
        $scope.division_machine_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
        
    }
);
