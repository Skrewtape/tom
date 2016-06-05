angular.module('app.player_add.process.edit_linked_division.process',['app.player_add.process.edit_linked_division.process.ticket_purchase']);
angular.module('app.player_add.process.edit_linked_division.process').controller(
    'app.player_add.process.edit_linked_division.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	$scope.division_id=$state.params.divisionId;
	if($scope.checkForBlankParams($scope.division_id) == true){
	    return;
	}
        StatusModal.loading();
	$scope.player_edit_promise = TimeoutResources.EditPlayer(undefined,{player_id:$scope.player_id},{division_id:$scope.division_id})        
        $scope.division_promise = TimeoutResources.GetDivision($scope.player_edit_promise,{division_id:$scope.division_id});        
	$scope.player_promise = TimeoutResources.GetPlayer($scope.division_promise,{player_id:$scope.player_id})
	$scope.tournament_promise = TimeoutResources.GetTournament($scope.player_promise,{tournament_id:TimeoutResources.GetPlayerLinkedTournamentId})
	$scope.tournament_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();	    
	})
    }
);
