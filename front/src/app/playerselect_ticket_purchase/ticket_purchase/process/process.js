angular.module('app.playerselect_ticket_purchase.ticket_purchase.process',[/*REPLACEMECHILD*/]);
angular.module('app.playerselect_ticket_purchase.ticket_purchase.process').controller(
    'app.playerselect_ticket_purchase.ticket_purchase.process',
    function($scope, $state, StatusModal, TimeoutResources, Utils) {
	$scope.added_tokens=$state.params.addedTokens;
	$scope.player_id=$state.params.playerId;
	if($scope.checkForBlankParams($scope.added_tokens) == true){
	    return;
	}
	tokensToPost = {};
	tokensToPost.player_id = $scope.player_id;
	tokensToPost.tokens = [];
	StatusModal.loading();
	$scope.metadivisions = TimeoutResources.getAllMetadivisionsResource().getAllMetadivisions();	    	    
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.metadivisions_promise,{player_id:$scope.player_id})		
	
	$scope.divisions_promise = $scope.player_teams_promise.then(function(data){
	    $scope.divisions = TimeoutResources.getAllDivisionsResource().getAllDivisions();	    
	    return $scope.divisions.$promise;
	});
	$scope.tournaments_promise = $scope.divisions_promise.then(function(data){
	    $scope.tournaments = TimeoutResources.getActiveTournamentsResource().getActiveTournaments();	    
	    return $scope.tournaments.$promise;
	});
	
	$scope.tokens_submit_promise = $scope.tournaments_promise.then(function(data){
	    for(div_id in $scope.added_tokens.divisions){
		num_tokens = $scope.added_tokens.divisions[div_id];
		if(num_tokens > 0){
		    token_to_push = {division_id:div_id,num_tokens:num_tokens};
		    if($scope.tournaments[$scope.divisions[div_id].tournament_id].team_tournament == true && TimeoutResources.GetAllResources().player_teams!= undefined){
			token_to_push.team_id=TimeoutResources.GetAllResources().player_teams.teams[0].team_id
			//console.log(TimeoutResources.GetAllResources().player_teams.teams[0].team_id);
		    }
		    tokensToPost.tokens.push(token_to_push);
		}
	    }
	    for(metadiv_id in $scope.added_tokens.metadivisions){
		num_tokens = $scope.added_tokens.metadivisions[metadiv_id];
		tokensToPost.tokens.push({metadivision_id:metadiv_id,num_tokens:num_tokens});
	    }	

	    $scope.tokens = TimeoutResources.addTokensResource().addTokens(tokensToPost);
	    return $scope.tokens.$promise;
	});
	$scope.tokens_submit_promise.then(function(data){
	    StatusModal.loaded();
	})

	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
