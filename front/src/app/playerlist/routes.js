angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.playerlist', 
        { 
 	 url: '/playerlist',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerlist/playerlist.html',
 	       controller: 'app.playerlist',
 	     }
 	   }
       })//REPLACE_ME

})
