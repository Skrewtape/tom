angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.metadivision_add', 
        { 
 	 url: '/metadivision_add',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/metadivision_add/metadivision_add.html',
 	       controller: 'app.metadivision_add',
 	     },
		'backbutton@app.metadivision_add':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.metadivision_add':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.metadivision_add.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/metadivision_add/process/process.html',
 	       controller: 'app.metadivision_add.process',
 	     },
		'backbutton@app.metadivision_add.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.metadivision_add.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 },
	    params:{
		newMetadivision: {}
	    }
       })//REPLACE_ME


})
