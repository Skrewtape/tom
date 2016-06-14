angular.module('app.playerselect_player_edit.player_edit.link_division.process',[/*REPLACEMECHILD*/]);
angular.module('app.playerselect_player_edit.player_edit.link_division.process').controller(
    'app.playerselect_player_edit.player_edit.link_division.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	$scope.division_id=$state.params.divisionId;
	if($scope.checkForBlankParams($scope.division_id) == true){
	    return;
	}
        StatusModal.loading();
	$scope.player_edit_promise = TimeoutResources.EditPlayer(undefined,{player_id:$scope.player_id},{division_id:$scope.division_id})
	$scope.division_promise = TimeoutResources.GetAllDivisions($scope.player_edit_promise)
	$scope.player_promise = TimeoutResources.GetPlayer($scope.division_promise,{player_id:$scope.player_id})
        $scope.player_promise.then(function(data){
	    return TimeoutResources.GetTournament($scope.player_promise,{tournament_id:data.linked_division.tournament_id});            
        }).then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();	    
        });
        
    }
);
