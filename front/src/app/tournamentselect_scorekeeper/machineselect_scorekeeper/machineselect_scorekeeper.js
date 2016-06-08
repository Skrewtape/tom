angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper','app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper',    
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.division_id=$state.params.divisionId;
	StatusModal.loading();        
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments();
	$scope.division_promise = TimeoutResources.GetDivision($scope.tournaments_promise,{division_id:$scope.division_id});
	$scope.division_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
	});
    }
);
