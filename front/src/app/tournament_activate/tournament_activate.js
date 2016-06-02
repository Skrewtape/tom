//killroy was here
angular.module('app.tournament_activate',[/*REPLACEMECHILD*/]);
angular.module('app.tournament_activate').controller(
    'app.tournament_activate',
    function($scope, $state, StatusModal, TimeoutResources) {
	StatusModal.loading();
	$scope.tournament_state = {};
	$scope.tournaments_promise = TimeoutResources.GetAllTournaments();
	$scope.tournaments_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();
	});
	$scope.toggle_tournament = function(tournament){            
	    //Remember - this is the value AFTER the slider has been changed            
            if(tournament.active == true){
		action='begin'
	    } else {
		action='end'
	    }
	    StatusModal.loading();
	    $scope.tournament_active_promise = TimeoutResources.ToggleTournamentActive(undefined,
                                               {tournament_id:tournament.tournament_id,action:action});	    
	    $scope.tournament_active_promise.then(function(data){
		StatusModal.loaded();
	    });
	};
    }
);
