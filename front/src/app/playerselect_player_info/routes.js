angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.playerselect_player_info', 
        { 
 	 url: '/playerselect_player_info',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_info/playerselect_player_info.html',
 	       controller: 'app.playerselect_player_info',
 	     }
 	   }
       }).state('app.playerselect_player_info.player_info', 
        { 
 	 url: '/player_info',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_info/player_info/player_info.html',
 	       controller: 'app.playerselect_player_info.player_info',
 	     }
 	   }
       })//REPLACE_ME


})
