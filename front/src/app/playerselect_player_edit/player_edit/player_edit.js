angular.module('app.playerselect_player_edit.player_edit',['app.playerselect_player_edit.player_edit.link_division',/*REPLACEMECHILD*/]);
angular.module('app.playerselect_player_edit.player_edit').controller(
    'app.playerselect_player_edit.player_edit',
    function($scope, $state, StatusModal, TimeoutResources, Utils) {
	$scope.player_id=$state.params.playerId;
	$scope.truncateString = Utils.truncateString;
	$scope.change_score = Utils.change_score;
	$scope.score_and_machine_change = Utils.score_and_machine_change
	$scope.remove_score = Utils.remove_score
	$scope.setEntryVoidStatus = Utils.setEntryVoidStatus
	$scope.score_machine={}
	StatusModal.loading()

	$scope.division_promise = TimeoutResources.GetAllDivisions()
	$scope.player_promise = TimeoutResources.GetPlayer($scope.division_promise,{player_id:$scope.player_id})
	$scope.machines_promise = TimeoutResources.GetActiveMachines($scope.player_promise)	
	$scope.player_entries_promise = TimeoutResources.GetAllPlayerEntries($scope.machines_promise,{player_id:$scope.player_id})	
	$scope.player_entries_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
            //FIXME : not actual fixme, but should be using this convertObjToArray instead of doing it at the timeoutresrouces level
	    $scope.machines_array = Utils.convertObjToArray($scope.resources.machines)
	    StatusModal.loaded()
	})
    }
);
