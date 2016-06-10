angular.module('app.edit_all_entries',[/*REPLACEMECHILD*/]);
angular.module('app.edit_all_entries').controller(
    'app.edit_all_entries',
    function($scope, $state, StatusModal, TimeoutResources, Utils) {
	$scope.truncateString = Utils.truncateString;
	$scope.change_score = Utils.change_score;
	$scope.score_and_machine_change = Utils.score_and_machine_change
	$scope.remove_score = Utils.remove_score
	$scope.setEntryVoidStatus = Utils.setEntryVoidStatus
	$scope.score_machine={}

        StatusModal.loading();
        $scope.division_promise = TimeoutResources.GetAllDivisions()        
	$scope.machines_promise = TimeoutResources.GetActiveMachines($scope.division_machine_promise)	
	$scope.all_entries_promise = TimeoutResources.GetAllEntries($scope.machines_promise,{count:100})
        
        $scope.all_entries_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();            
            
	    StatusModal.loaded()
	})


	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});	    
    }
);
