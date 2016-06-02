angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process',[/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process',
    function($scope, $state, StatusModal, TimeoutResources) {
        $scope.player_id=$state.params.playerId;
	$scope.entry_id=$state.params.entryId;        
        $scope.asshole = $state.params.asshole;
        $scope.division_machine_id = $state.params.divisionMachineId;
	if($scope.checkForBlankParams($scope.asshole) == true){
	    return;
	}
        StatusModal.loading();
	$scope.asshole_promise = TimeoutResources.PlayerIsAsshole(undefined,{division_machine_id:$scope.division_machine_id,player_id:$scope.player_id,entry_id:$scope.entry_id},{/*post_data*/});
        $scope.asshole_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
    }
);
