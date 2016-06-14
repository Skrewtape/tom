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
 	     },
             'edit_entries@app.playerselect_player_edit.player_edit': {
                 templateUrl: 'shared_html/edit_entries.html',
             }
 	   }
       }).state('app.playerselect_player_edit.player_edit.link_division', 
        { 
 	 url: '/link_division',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_edit/player_edit/link_division/link_division.html',
 	       controller: 'app.playerselect_player_edit.player_edit.link_division',
 	     }
 	   }
       }).state('app.playerselect_player_edit.player_edit.link_division.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_edit/player_edit/link_division/process/process.html',
 	       controller: 'app.playerselect_player_edit.player_edit.link_division.process',
 	     }
 	   },
	    params: {
		divisionId: {}
	    }
       })//REPLACE_ME




})
