angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.finals_activate', 
        { 
 	 url: '/finals_activate',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finals_activate/finals_activate.html',
 	       controller: 'app.finals_activate',
 	     },
		'backbutton@app.finals_activate':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.finals_activate':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       })//REPLACE_ME

})
