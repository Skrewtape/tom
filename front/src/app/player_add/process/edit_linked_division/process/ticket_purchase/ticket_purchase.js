angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase',[]);
angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase').controller(
    'app.player_add.process.edit_linked_division.process.ticket_purchase',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;

	$scope.get_metadivision_for_division = function(division_id){
	    for(metadivision_index in $scope.metadivisions){
		metadivision = $scope.metadivisions[metadivision_index];
		for(division_index in metadivision.divisions){
		    if (division_index == division_id){
			return metadivision;
		    }
		}
	    }
	    return undefined;
	}
	
	$scope.division_in_metadivision = function(division_id){
	    if($scope.get_metadivision_for_division(division_id) == undefined){
		return false
	    }
	    return true;
	}
	
	$scope.get_division_from_tournament = function(division_id){
	    for(tournament_index in $scope.tournaments){
		tournament = $scope.tournaments[tournament_index];
		for(division_index in tournament.divisions){
		    division = tournament.divisions[division_index];
		    if(division_id == division.division_id){
			return division;
		    }
		}
	    }
	}
	
        StatusModal.loading();
	$scope.metadivisions = TimeoutResources.getAllMetadivisionsResource().getAllMetadivisions();	    	    
	$scope.player_promise = $scope.metadivisions.$promise.then(function(data){
	    $scope.player = TimeoutResources.getPlayerResource().getPlayer({player_id:$scope.player_id});
	    return $scope.player.$promise;
	})
	$scope.tournaments_promise = $scope.player_promise.then(function(data){
	    $scope.tournaments = TimeoutResources.getActiveTournamentsResource().getActiveTournaments();	    
	    return $scope.tournaments.$promise;
	});
	$scope.player_tokens_promise = $scope.tournaments_promise.then(function(data){
	    $scope.player_tokens = TimeoutResources.getTokensForPlayerResource().getTokensForPlayer({player_id:$scope.player_id});	    	    
	    return $scope.player_tokens.$promise
	})
	$scope.player_tokens_promise.then(function(data){
	    StatusModal.loaded();
	})
	
    }
);
