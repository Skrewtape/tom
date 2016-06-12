angular.module('app.player_purchasetickets.process',[/*REPLACEMECHILD*/]);
angular.module('app.player_purchasetickets.process').controller(
    'app.player_purchasetickets.process',
    function($scope, $state, StatusModal, TimeoutResources) {
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
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.metadivisions_promise,{player_id:$scope.player_id});		
	$scope.divisions_promise = TimeoutResources.GetAllDivisions($scope.player_teams_promise);			
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.divisions_promise);
	$scope.tokens_submit_promise = TimeoutResources.AddTokens($scope.tournaments_promise,undefined,$scope.added_tokens);	
	$scope.tokens_submit_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();            
	    StatusModal.loaded();
	});
    }
);
