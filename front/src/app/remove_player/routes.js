angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.remove_player', 
        { 
 	 url: '/remove_player',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/remove_player/remove_player.html',
 	       controller: 'app.remove_player',
 	     },
             'backbutton@app.remove_player':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.remove_player':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.remove_player.confirm', 
        { 
 	 url: '/confirm/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/remove_player/confirm/confirm.html',
 	       controller: 'app.remove_player.confirm',
 	     },
             'backbutton@app.remove_player.confirm':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.remove_player.confirm':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.remove_player.confirm.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/remove_player/confirm/process/process.html',
 	       controller: 'app.remove_player.confirm.process',
 	     },
             'backbutton@app.remove_player.confirm.process':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.remove_player.confirm.process':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       })//REPLACE_ME



})
