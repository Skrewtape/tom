angular.module('app.player_purchasetickets.process',[/*REPLACEMECHILD*/]);
angular.module('app.player_purchasetickets.process').controller(
    'app.player_purchasetickets.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.added_tokens=$state.params.addedTokens;
	$scope.player_id=$state.params.playerId;
        $scope.stripe_token = $state.params.stripeToken;
        $scope.total_steps = 7;
        $scope.current_steps = 0;
        
	if($scope.checkForBlankParams($scope.added_tokens) == true){
	    return;
	}
        //StatusModal.loading();
        $scope.increment_progress = function(){
            $scope.current_steps++;
            return Math.floor(($scope.current_steps/$scope.total_steps)*100) +'%';
        }
        
        
        StatusModal.changeRunningStatusMsg('Getting MetaDivisions');
	$scope.metadivisions_promise = TimeoutResources.GetAllMetadivisions().then(function(data){
            StatusModal.changeRunningStatusMsg('Get Teams :'+ $scope.increment_progress());
        });
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.metadivisions_promise,{player_id:$scope.player_id}).then(function(data){
            StatusModal.changeRunningStatusMsg('Get Divisions : '+$scope.increment_progress());
        });		
	$scope.divisions_promise = TimeoutResources.GetAllDivisions($scope.player_teams_promise).then(function(data){
            StatusModal.changeRunningStatusMsg('Get Tournaments : '+$scope.increment_progress());
        });			
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.divisions_promise).then(function(data){
            StatusModal.changeRunningStatusMsg('Adding tokens : '+$scope.increment_progress());
        });
        $scope.tokens_submit_promise = TimeoutResources.AddConditionalTokens($scope.tournaments_promise,undefined,$scope.added_tokens).then(function(data){
            StatusModal.changeRunningStatusMsg('Charging Card : '+$scope.increment_progress());
        });
        $scope.swipe_promise = TimeoutResources.SwipeTickets($scope.tokens_submit_promise,{},{stripeToken:$scope.stripe_token.id,addedTokens:$scope.added_tokens,email:$scope.stripe_token.email});
	$scope.swipe_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.changeRunningStatusMsg('Completing : '+$scope.increment_progress());            
            TimeoutResources.ConfirmTokensPurchase(undefined,{},$scope.resources.add_tokens_result).then(function(data){
                StatusModal.loaded();
                console.log($scope.resources);
            });
            
	 }, function(data){
             //OOPS - we need an actual error here
	     StatusModal.loaded();             
         });        
    }
);
