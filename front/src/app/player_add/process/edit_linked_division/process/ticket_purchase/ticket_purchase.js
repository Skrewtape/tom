angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase',['app.player_add.process.edit_linked_division.process.ticket_purchase.process',/*REPLACEMECHILD*/]);
angular.module('app.player_add.process.edit_linked_division.process.ticket_purchase').controller(
    'app.player_add.process.edit_linked_division.process.ticket_purchase',
    function($scope, $state, StatusModal, TimeoutResources, Utils) {
	$scope.player_id=$state.params.playerId;	
    }
);
