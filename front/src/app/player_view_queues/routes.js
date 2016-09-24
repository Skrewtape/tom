angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.player_view_queues', 
        { 
 	 url: '/player_view_queues',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_view_queues/player_view_queues.html',
 	       controller: 'app.player_view_queues',
 	     },
             'backbutton@app.player_view_queues':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_view_queues':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.player_view_queues.division_view', 
        { 
 	 url: '/division_view/:division_id',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_view_queues/division_view/division_view.html',
 	       controller: 'app.player_view_queues.division_view',
 	     },
             'backbutton@app.player_view_queues.division_view':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_view_queues.division_view':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       })//REPLACE_ME


})
