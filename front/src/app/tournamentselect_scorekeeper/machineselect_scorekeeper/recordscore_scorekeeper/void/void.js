angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.entry_id = $state.params.entryId;
        $scope.division_machine_id = $state.params.divisionMachineId;
	//if($scope.checkForBlankParams($scope.entry_id) == true){
	//    return;
	//}
        console.log($scope.entry_id);
	if( JSON.stringify($scope.entry_id) === JSON.stringify({})){
	    $scope.void_promise = TimeoutResources.VoidEntryBeforeCreate(undefined,{division_machine_id:$scope.division_machine_id})            
        } else {
	    $scope.void_promise = TimeoutResources.VoidEntry(undefined,{entry_id:$scope.entry_id})
        }
	$scope.void_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	})        
    }
);
