angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.playerselect_ticket_purchase', 
        { 
 	 url: '/playerselect_ticket_purchase',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_ticket_purchase/playerselect_ticket_purchase.html',
 	       controller: 'app.playerselect_ticket_purchase',
 	     }
 	   }
       }).state('app.playerselect_ticket_purchase.ticket_purchase', 
        { 
 	 url: '/ticket_purchase/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_ticket_purchase/ticket_purchase/ticket_purchase.html',
 	       controller: 'app.playerselect_ticket_purchase.ticket_purchase',
 	     }
 	   }
       }).state('app.playerselect_ticket_purchase.ticket_purchase.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_ticket_purchase/ticket_purchase/process/process.html',
 	       controller: 'app.playerselect_ticket_purchase.ticket_purchase.process',
 	     }
 	 },
	    params: {addedTokens:{}}
       })//REPLACE_ME
})
