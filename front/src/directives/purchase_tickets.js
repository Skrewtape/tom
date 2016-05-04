//FIXME : handle multiple tournaments with multiple divisions
angular.module('tom_directives.purchase_tickets', []);
angular.module('tom_directives.purchase_tickets').controller(
    'purchase_tickets',function($scope, $state, StatusModal, TimeoutResources, Utils){
	$scope.max_unstarted_tickets = 5;
	$scope.added_tokens = {metadivisions:{},divisions:{}};	
	$scope.change_division_tickets = Utils.change_division_tickets;
	
	$scope.get_metadivision_for_division = Utils.get_metadivision_for_division;
	$scope.division_in_metadivision = Utils.division_in_metadivision
	
        StatusModal.loading();
	$scope.metadivisions_promise = TimeoutResources.GetAllMetadivisions()
	$scope.player_promise = TimeoutResources.GetPlayer($scope.metadivisions_promise,{player_id:$scope.player_id})	
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.player_promise);
	$scope.player_tokens_promise = TimeoutResources.GetPlayerTokens($scope.tournaments_promise,{player_id:$scope.player_id});	
	$scope.player_tokens_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    Utils.build_added_tokens($scope.resources.player_tokens,$scope.added_tokens);
	    StatusModal.loaded();
	})
	
    }
).directive('purchaseTickets', function() {
    return {
	transclude: true,

	templateUrl: 'directives/purchase_tickets.html'
    };
});;
