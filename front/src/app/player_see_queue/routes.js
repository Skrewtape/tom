angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.player_see_queue', 
        { 
 	 url: '/player_see_queue',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_see_queue/player_see_queue.html',
 	       controller: 'app.player_see_queue',
 	     },
             'backbutton@app.player_see_queue':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_see_queue':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.player_see_queue.division_machines', 
        { 
 	 url: '/division_machines/:divisionId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_see_queue/division_machines/division_machines.html',
 	       controller: 'app.player_see_queue.division_machines',
 	     },
             'backbutton@app.player_see_queue.division_machines':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_see_queue.division_machines':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.player_see_queue.division_machines.queue', 
        { 
 	 url: '/queue/:divisionMachineId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_see_queue/division_machines/queue/queue.html',
 	       controller: 'app.player_see_queue.division_machines.queue',
 	     },
             'backbutton@app.player_see_queue.division_machines.queue':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_see_queue.division_machines.queue':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       })//REPLACE_ME



})
