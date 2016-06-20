angular.module('app.finals_activate.playerselect.process',[/*REPLACEMECHILD*/]);
angular.module('app.finals_activate.playerselect.process').controller(
    'app.finals_activate.playerselect.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	//$scope.player_info=$state.params.newPlayerInfo;
	if($scope.checkForBlankParams($state.params.checkedPlayers) == true){
	    return;
	}
	$scope.player_promise = TimeoutResources.GetAllPlayers(undefined);
        $scope.number_checked = 0;
        $scope.checked_players = $state.params.checkedPlayers;
        $scope.division_id = $state.params.divisionId;
        $scope.list_of_checked_players = "";
        for(idx in $scope.checked_players){
            if($scope.checked_players[idx].checked == true){
                if(idx != 0){
                    $scope.list_of_checked_players = $scope.list_of_checked_players+",";
                }
                $scope.list_of_checked_players = $scope.list_of_checked_players+$scope.checked_players[idx].player_id;                
            }
        }
	StatusModal.loading();
	$scope.add_finals_promise = TimeoutResources.AddFinals($scope.player_promise,{division_id:$scope.division_id});
	$scope.add_finals_promise.then(function(data){
	    finals_id=data.finals_id;
	    $scope.gen_finals_promise = TimeoutResources.GenerateFinalsRounds($scope.add_finals_promise,{finals_id:finals_id});
	    $scope.fill_finals_promise = TimeoutResources.FillFinalsRounds($scope.gen_finals_promise,{finals_id:finals_id,checked_players:$scope.list_of_checked_players});
	    $scope.fill_finals_promise.then(function(data){
	     	$scope.get_finals_promise = TimeoutResources.GetFinals();		
	     	$scope.get_finals_promise.then(function(data){
	     	    $scope.resources = TimeoutResources.GetAllResources();
		    StatusModal.loaded();
	     	});
	    });
	});                           
    }
);
