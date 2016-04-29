angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.tournament_activate', 
        { 
 	 url: '/tournament_activate',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournament_activate/tournament_activate.html',
 	       controller: 'app.tournament_activate',
 	     }
 	   }
       })//REPLACE_ME

})
