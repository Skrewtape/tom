angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.playerselect_player_edit', 
        { 
 	 url: '/playerselect_player_edit',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_edit/playerselect_player_edit.html',
 	       controller: 'app.playerselect_player_edit',
 	     },
		'backbutton@app.playerselect_player_edit':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.playerselect_player_edit':{
		templateUrl: 'shared_html/not_backbutton.html'
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
		'backbutton@app.playerselect_player_edit.player_edit':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.playerselect_player_edit.player_edit':{
		templateUrl: 'shared_html/not_backbutton.html'
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
 	     },
		'backbutton@app.playerselect_player_edit.player_edit.link_division':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.playerselect_player_edit.player_edit.link_division':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.playerselect_player_edit.player_edit.link_division.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_edit/player_edit/link_division/process/process.html',
 	       controller: 'app.playerselect_player_edit.player_edit.link_division.process',
 	     },
		'backbutton@app.playerselect_player_edit.player_edit.link_division.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.playerselect_player_edit.player_edit.link_division.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   },
	    params: {
		divisionId: {}
	    }
       })//REPLACE_ME




})
