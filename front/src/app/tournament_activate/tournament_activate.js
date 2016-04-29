angular.module('app.tournament_activate',[/*REPLACEMECHILD*/]);
angular.module('app.tournament_activate').controller(
    'app.tournament_activate',
    function($scope, $state, StatusModal, TimeoutResources) {
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	StatusModal.loading();
	$scope.tournament_state = {}
	$scope.tournaments = TimeoutResources.getAllTournamentsResource().getAllTournaments();
	$scope.tournaments.$promise.then(function(data){
	    for(tournament_index in $scope.tournaments){
		tournament = $scope.tournaments[tournament_index];
		$scope.tournament_state[tournament.tournament_id] = tournament.active;
	    }
	    StatusModal.loaded();
	})
	$scope.toggle_tournament = function(tournament){
	    console.log($scope.tournament_state);
	    //Remember - this is the value AFTER the slider has been changed
	    if($scope.tournament_state[tournament.tournament_id] == true){
		action='begin'
	    } else {
		action='end'
	    }
	    StatusModal.loading();
	    $scope.tournament = TimeoutResources.toggleTournamentActiveResource().toggleTournamentActive({tournament_id:tournament.tournament_id,action:action});	    
	    $scope.tournament.$promise.then(function(data){
		StatusModal.loaded();
	    })
	}
    }
);
