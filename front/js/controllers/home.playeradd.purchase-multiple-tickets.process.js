app.controller(
    'home_playeradd_purchase-multiple-tickets_process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Purchase Tickets');
	$scope.tickets_purchased = $state.params.ticketsPurchased;
	$scope.player_id = $state.params.playerId;
	$scope.buy_tickets = function(){
            $http.post('[APIHOST]/entry/player/'+$scope.player_id,$scope.tickets_purchased,{timeout:5000}).success(
                function(data) {                    
                    //$scope.player = data;
		    console.log(data);
		    StatusModal.loaded();
                }
            );
	}
	StatusModal.loading('home.playeradd.purchase-multiple-tickets.process.js - buying tickets');
	$scope.buy_tickets();
    });
