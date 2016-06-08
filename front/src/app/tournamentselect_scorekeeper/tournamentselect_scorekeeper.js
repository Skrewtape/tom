angular.module('app.tournamentselect_scorekeeper',['app.tournamentselect_scorekeeper.machineselect_scorekeeper',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper').controller(
    'app.tournamentselect_scorekeeper',
    function($scope, $state, StatusModal, TimeoutResources) {
        StatusModal.loading();
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments();
	$scope.tournaments_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
	});
    }
);
