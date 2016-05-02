angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase.process',[/*REPLACEMECHILD*/]);
angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase.process').controller(
    'app.player_add.process.edit_linked_division.process.ticket_purchase.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.added_tokens=$state.params.addedTokens;
	$scope.player_id=$state.params.playerId;
	if($scope.checkForBlankParams($scope.added_tokens) == true){
	    return;
	}
	tokensToPost = {};
	tokensToPost.player_id = $scope.player_id;
	tokensToPost.tokens = [];
	for(div_id in $scope.added_tokens.divisions){
	    num_tokens = $scope.added_tokens.divisions[div_id]
	    tokensToPost.tokens.push({division_id:div_id,num_tokens:num_tokens});
	}
	for(metadiv_id in $scope.added_tokens.metadivisions){
	    num_tokens = $scope.added_tokens.metadivisions[metadiv_id]
	    tokensToPost.tokens.push({metadivision_id:metadiv_id,num_tokens:num_tokens});
	}	
	StatusModal.loading();
	$scope.metadivisions = TimeoutResources.getAllMetadivisionsResource().getAllMetadivisions();	    	    

	$scope.divisions_promise = $scope.metadivisions.$promise.then(function(data){
	    $scope.divisions = TimeoutResources.getAllDivisionsResource().getAllDivisions();	    
	    return $scope.divisions.$promise;
	});
	$scope.tournaments_promise = $scope.divisions_promise.then(function(data){
	    $scope.tournaments = TimeoutResources.getActiveTournamentsResource().getActiveTournaments();	    
	    return $scope.tournaments.$promise;
	});
	
	$scope.tokens_submit_promise = $scope.tournaments_promise.then(function(data){
	    
	    $scope.tokens = TimeoutResources.addTokensResource().addTokens(tokensToPost);
	    return $scope.tokens.$promise;
	});
	$scope.tokens_submit_promise.then(function(data){
	    StatusModal.loaded();
	})
    }
);
