angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper','app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper',    
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.division_id=$state.params.divisionId;
	StatusModal.loading();
        //$scope.queue={11:[{first_name:'aiton',last_name:'goldman',player_id:'1'}]};
        $scope.queue_promise = TimeoutResources.GetDivisionQueue(undefined,{division_id:$scope.division_id});

	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.queue_promise);        
	$scope.division_promise = TimeoutResources.GetDivision($scope.tournaments_promise,{division_id:$scope.division_id});
	$scope.division_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
	});
    }
);
