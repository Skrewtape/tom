angular.module('app.finalselect_finals.matchselect_finals',['app.finalselect_finals.matchselect_finals.matchscores_finals',/*REPLACEMECHILD*/]);
angular.module('app.finalselect_finals.matchselect_finals').controller(
    'app.finalselect_finals.matchselect_finals',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.finals_id=$state.params.finalsId;
	$scope.state = $state;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	StatusModal.loading()
	$scope.finals_matches_promise = TimeoutResources.GetFinalsMatches(undefined,{finals_id:$scope.finals_id});
	$scope.finals_matches_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources()
	    StatusModal.loaded()	    
	})

	$scope.add_player_to_match = function(finals_match){
	    console.log('okay');
	}
	
	$scope.are_all_players_set_in_match = function(finals_match){
	    for(finals_player_key in finals_match.finals_players){
		if (finals_match.finals_players[finals_player_key].player_id == null){
		    return false;
		}
	    }
	    return true;
	}
	    
	$scope.open_match = function(finals_match){
	    if($scope.are_all_players_set_in_match(finals_match)){
		$state.go(".matchscores_finals",{matchId:finals_match.match_id})		
	    }
	    //$state.go(".matchscores_finals",{matchId:finals_match.match_id})
	}
    }
);
