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
	$scope.metadivisions_promise = TimeoutResources.GetAllMetadivisions();
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.metadivisions_promise,{player_id:$scope.player_id})		
	$scope.divisions_promise = TimeoutResources.GetAllDivisions($scope.player_teams_promise)			
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.divisions_promise);
	$scope.tokens_submit_promise = TimeoutResources.AddTokens($scope.tournaments_promise,undefined,$scope.added_tokens);	
	// $scope.tokens_submit_promise = $scope.tournaments_promise.then(function(data){
	//     for(div_id in $scope.added_tokens.divisions){
	// 	num_tokens = $scope.added_tokens.divisions[div_id];
	// 	if(num_tokens > 0){
	// 	    token_to_push = {division_id:div_id,num_tokens:num_tokens};
	// 	    tokensToPost.tokens.push(token_to_push);
	// 	}
	//     }
	//     for(metadiv_id in $scope.added_tokens.metadivisions){
	// 	num_tokens = $scope.added_tokens.metadivisions[metadiv_id];
	// 	if(num_tokens > 0){
	// 	    tokensToPost.tokens.push({metadivision_id:metadiv_id,num_tokens:num_tokens});
	// 	}
	//     }
	    
	//     for(teamdiv_id in $scope.added_tokens.teams){
	// 	num_tokens = $scope.added_tokens.teams[teamdiv_id];
	// 	player_teams = TimeoutResources.GetAllResources().player_teams
	// 	if(num_tokens > 0 && player_teams != undefined){
	// 	    token_to_push = {division_id:teamdiv_id,num_tokens:num_tokens,team_id:player_teams.teams[0].team_id};
	// 	    tokensToPost.tokens.push(token_to_push);
	// 	}
	//     }	
	    

	//     $scope.tokens_promise = TimeoutResources.AddTokens(undefined,undefined,tokensToPost);
	//     return $scope.tokens_promise;
	// });
	$scope.tokens_submit_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();
	})

    }
);
