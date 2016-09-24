angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.player_remove_queue', 
        { 
 	 url: '/player_remove_queue/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_remove_queue/player_remove_queue.html',
 	       controller: 'app.player_remove_queue',
 	     },
             'backbutton@app.player_remove_queue':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_remove_queue':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.player_remove_queue.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_remove_queue/process/process.html',
 	       controller: 'app.player_remove_queue.process',
 	     },
             'backbutton@app.player_remove_queue.process':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_remove_queue.process':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       })//REPLACE_ME


})
