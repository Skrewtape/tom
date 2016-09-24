angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.player_add_queue', 
        { 
 	 url: '/player_add_queue/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_add_queue/player_add_queue.html',
 	       controller: 'app.player_add_queue',
 	     },
             'backbutton@app.player_add_queue':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_add_queue':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.player_add_queue.division_machines', 
        { 
 	 url: '/division_machines/:divisionId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_add_queue/division_machines/division_machines.html',
 	       controller: 'app.player_add_queue.division_machines',
 	     },
             'backbutton@app.player_add_queue.division_machines':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_add_queue.division_machines':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.player_add_queue.division_machines.confirm', 
        { 
 	 url: '/confirm/:divisionMachineId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_add_queue/division_machines/confirm/confirm.html',
 	       controller: 'app.player_add_queue.division_machines.confirm',
 	     },
             'backbutton@app.player_add_queue.division_machines.confirm':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_add_queue.division_machines.confirm':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.player_add_queue.division_machines.confirm.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_add_queue/division_machines/confirm/process/process.html',
 	       controller: 'app.player_add_queue.division_machines.confirm.process',
 	     },
             'backbutton@app.player_add_queue.division_machines.confirm.process':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_add_queue.division_machines.confirm.process':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	 },
            params: {dummy:{}}
            
       })//REPLACE_ME




})
