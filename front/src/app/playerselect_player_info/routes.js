angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.playerselect_player_info', 
        { 
 	 url: '/playerselect_player_info',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_info/playerselect_player_info.html',
 	       controller: 'app.playerselect_player_info',
 	     },
		'backbutton@app.playerselect_player_info':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.playerselect_player_info':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.playerselect_player_info.player_info', 
        { 
 	 url: '/player_info/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_player_info/player_info/player_info.html',
 	       controller: 'app.playerselect_player_info.player_info',
 	     },
		'backbutton@app.playerselect_player_info.player_info':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.playerselect_player_info.player_info':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       })//REPLACE_ME


})
