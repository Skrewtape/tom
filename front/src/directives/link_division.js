//FIXME : handle multiple tournaments with multiple divisions
angular.module('tom_directives.link_division', []);
angular.module('tom_directives.link_division').controller(
    'link_division',function($scope, $state, StatusModal, TimeoutResources){
	$scope.player_id=$state.params.playerId;
	$scope.linked_division = {value:undefined};
        StatusModal.loading();
	//$scope.tournaments = TimeoutResources.getActiveTournamentsResource().getActiveTournaments();	
	//$scope.player_promise = $scope.tournaments.$promise.then(function(data){
	//    $scope.player = TimeoutResources.getPlayerResource().getPlayer({player_id:$scope.player_id});
	//    return $scope.player.$promise;
	//})
	$scope.player_promise = TimeoutResources.GetPlayer(undefined,{player_id:$scope.player_id});
        $scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.player_promise);
	//FIXME : guyh - need a cleaner way to pass results from previous TimeoutResources call as params for current call
	$scope.ifpa_player_promise = TimeoutResources.GetIfpaPlayer($scope.tournaments_promise,{player_name:TimeoutResources.GetPlayerNameSmushed});
	$scope.ifpa_player_promise.then(function(data){
	    StatusModal.loaded();
	    $scope.resources = TimeoutResources.GetAllResources();
	    if($scope.resources.player.linked_division==null){
		return;
	    }
	    $scope.linked_division.value = data.linked_division.division_id;
	    //for(linked_div_index in $scope.player.linked_division){
	    //	linked_div = $scope.player.linked_division[linked_div_index];
	    //	$scope.selected_division[linked_div.tournament_id]=linked_div;
	    //}

	})

	$scope.check_for_division_warning = function(division){
	    if($scope.resources.player.linked_division != null && $scope.resources.player.linked_division.name>division.name){
		StatusModal.modalWithMessage('services/change_player_division_warning.html',{});
	    }
	}
	$scope.division_disabled_for_player = function(division){
	    if($scope.resources.player.linked_division != null && $scope.resources.player.linked_division.name<division.name){
		return true
	    }
	    return false
	}
	

	
    }).directive('linkDivision', function() {
    return {
	transclude: true,
	templateUrl: 'directives/link_division.html'
    };
});
