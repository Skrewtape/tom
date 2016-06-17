angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.tournament_activate', 
        { 
 	 url: '/tournament_activate',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournament_activate/tournament_activate.html',
 	       controller: 'app.tournament_activate',
 	     },
		'backbutton@app.tournament_activate':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournament_activate':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       })//REPLACE_ME

})
