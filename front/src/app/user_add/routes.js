angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.user_add', 
        { 
 	 url: '/user_add',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/user_add/user_add.html',
 	       controller: 'app.user_add',
 	     }
 	   }
       }).state('app.user_add.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/user_add/process/process.html',
 	       controller: 'app.user_add.process',
 	     }
 	 },
	    params:{
		newUser:{}
	    }
       })//REPLACE_ME


})
