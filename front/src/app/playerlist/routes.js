angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.playerlist', 
        { 
 	 url: '/playerlist',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerlist/playerlist.html',
 	       controller: 'app.playerlist',
 	     },
		'backbutton@app.playerlist':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.playerlist':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       })//REPLACE_ME

})
