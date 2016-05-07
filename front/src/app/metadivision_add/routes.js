angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.metadivision_add', 
        { 
 	 url: '/metadivision_add',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/metadivision_add/metadivision_add.html',
 	       controller: 'app.metadivision_add',
 	     }
 	   }
       }).state('app.metadivision_add.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/metadivision_add/process/process.html',
 	       controller: 'app.metadivision_add.process',
 	     }
 	 },
	    params:{
		newMetadivision: {}
	    }
       })//REPLACE_ME


})
