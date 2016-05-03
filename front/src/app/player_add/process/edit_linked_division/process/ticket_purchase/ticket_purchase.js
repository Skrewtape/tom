angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase',['app.player_add.process.edit_linked_division.process.ticket_purchase.process',/*REPLACEMECHILD*/]);
angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase').controller(
    'app.player_add.process.edit_linked_division.process.ticket_purchase',
    function($scope, $state, StatusModal, TimeoutResources, Utils) {
	$scope.player_id=$state.params.playerId;
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
);
