angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase.process',[/*REPLACEMECHILD*/]);
angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase.process').controller(
    'app.player_add.process.edit_linked_division.process.ticket_purchase.process',
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
        //FIXME : shouldn't need to load all these things just to get names
	$scope.metadivisions_promise = TimeoutResources.GetAllMetadivisions();        
	$scope.divisions_promise = TimeoutResources.GetAllDivisions($scope.player_metadivisions_promise);			
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.divisions_promise);
	$scope.tokens_submit_promise = TimeoutResources.AddTokens($scope.tournaments_promise,undefined,$scope.added_tokens);	
	$scope.tokens_submit_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();
	});
    }
);
