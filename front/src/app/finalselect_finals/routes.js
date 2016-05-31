angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.finalselect_finals', 
        { 
 	 url: '/finalselect_finals',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finalselect_finals/finalselect_finals.html',
 	       controller: 'app.finalselect_finals',
 	     }
 	   }
       }).state('app.finalselect_finals.matchselect_finals', 
        { 
 	 url: '/matchselect_finals/:finalsId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finalselect_finals/matchselect_finals/matchselect_finals.html',
 	       controller: 'app.finalselect_finals.matchselect_finals',
 	     }
 	   }
       }).state('app.finalselect_finals.matchselect_finals.matchscores_finals', 
        { 
 	 url: '/matchscores_finals/:matchId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finalselect_finals/matchselect_finals/matchscores_finals/matchscores_finals.html',
 	       controller: 'app.finalselect_finals.matchselect_finals.matchscores_finals',
 	     }
 	   }
       })//REPLACE_ME



})
