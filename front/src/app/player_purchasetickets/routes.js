angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.player_purchasetickets', 
        { 
 	 url: '/player_purchasetickets/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_purchasetickets/player_purchasetickets.html',
 	       controller: 'app.player_purchasetickets',
 	     }
 	   }
       }).state('app.player_purchasetickets.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_purchasetickets/process/process.html',
 	       controller: 'app.player_purchasetickets.process',
 	     }
 	 },
            params: {addedTokens:{}}
       })//REPLACE_ME


})
