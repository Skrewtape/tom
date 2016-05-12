angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm','app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper',
    function($scope, $state, StatusModal, TimeoutResources, $filter) {
	$scope.division_machine_id = $state.params.divisionMachineId;
	$scope.division_id=$state.params.divisionId;
	
	$scope.formatted_score = {};
	$scope.disabledScoreKeeping = true;
	$scope.onScoreChange = function(){
	    $scope.formatted_score.score = $filter('number')($scope.new_score);
	    if($scope.new_score > 0){
		$scope.disabledScoreKeeping = false;
	    } else {
		$scope.disabledScoreKeeping = true;
	    }
	}
	
	//SIGH : loading modal causes problem with input field focus
	//StatusModal.loading();
	$scope.machines_promise = TimeoutResources.GetActiveMachines();
	$scope.division_machine_promise = TimeoutResources.GetDivisionMachine($scope.machines_promise,{division_machine_id:$scope.division_machine_id});
	$scope.player_promise = TimeoutResources.GetPlayer($scope.division_machine_promise,{player_id:TimeoutResources.GetPlayerIdFromDivisionMachine});
	$scope.entry_id_promise = TimeoutResources.GetPlayerActiveEntry($scope.player_promise,
									{player_id:TimeoutResources.GetPlayerIdFromDivisionMachine,
									 division_id:$scope.division_id})
	
	$scope.entry_id_promise.then(function(data){
	    //StatusModal.loaded()
	    $scope.resources = TimeoutResources.GetAllResources();
	})
    }
);
