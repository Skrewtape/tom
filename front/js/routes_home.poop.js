app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('home.poop', 
       { 
	 url: 'poop',
	 views: {
	     '@': {
	       templateUrl: 'home.poop.html',
	       controller: 'home.poop',
	     }
	   }
       }).state('home.poop.shoop', 
       { 
	 url: '/shoop/:extraThing',
	 views: {
	     '@': {
	       templateUrl: 'home.poop.shoop.html',
	       controller: 'home.poop.shoop',
	     }
	   }
       }).state('home.poop.shoop.loop', 
       { 
	 url: '/loop',
	 views: {
	     '@': {
	       templateUrl: 'home.poop.shoop.loop.html',
	       controller: 'home.poop.shoop.loop',
	     }
	   }
       })//REPLACE_ME



})
