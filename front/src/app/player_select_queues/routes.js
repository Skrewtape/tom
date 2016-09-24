angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.player_select_queues', 
        { 
 	 url: '/player_select_queues',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_select_queues/player_select_queues.html',
 	       controller: 'app.player_select_queues',
 	     },
             'backbutton@app.player_select_queues':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.player_select_queues':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       })//REPLACE_ME

})
