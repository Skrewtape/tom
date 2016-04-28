angular.module('app.player_add.process.edit_linked_division.process',['app.player_add.process.edit_linked_division.process.ticket_purchase']);
angular.module('app.player_add.process.edit_linked_division.process').controller(
    'app.player_add.process.edit_linked_division.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	$scope.division_id=$state.params.divisionId;
	if($scope.checkForBlankParams($scope.player_id) == true){
	    return;
	}
        StatusModal.loading();
	$scope.player = TimeoutResources.editPlayerResource().editPlayer({player_id:$scope.player_id},{division_id:$scope.division_id});	    
	$scope.division_promise = $scope.player.$promise.then(function(data){
	    $scope.division = TimeoutResources.getDivisionResource().getDivision({division_id:$scope.division_id});	    
	    return $scope.division.$promise;
	});
	$scope.tournament_promise = $scope.division_promise.then(function(data){
	    $scope.tournament = TimeoutResources.getTournamentResource().getTournament({tournament_id:$scope.division.tournament_id});	    
	    return $scope.tournament.$promise;
	});
	$scope.tournament_promise.then(function(data){
	    StatusModal.loaded();
	})
    }
);
