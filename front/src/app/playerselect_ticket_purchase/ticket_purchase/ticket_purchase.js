angular.module('app.playerselect_ticket_purchase.ticket_purchase',['app.playerselect_ticket_purchase.ticket_purchase.process',/*REPLACEMECHILD*/]);
angular.module('app.playerselect_ticket_purchase.ticket_purchase').controller(
    'app.playerselect_ticket_purchase.ticket_purchase',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
	console.log($scope.player_id);
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
