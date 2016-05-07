angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.playerselect_player_edit', 
        { 
 	 url: '/playerselect_player_edit',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_edit/playerselect_player_edit.html',
 	       controller: 'app.playerselect_player_edit',
 	     }
 	   }
       }).state('app.playerselect_player_edit.player_edit', 
        { 
 	 url: '/player_edit/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_edit/player_edit/player_edit.html',
 	       controller: 'app.playerselect_player_edit.player_edit',
 	     }
 	   }
       })//REPLACE_ME


})
