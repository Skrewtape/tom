angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.user_add', 
        { 
 	 url: '/user_add',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/user_add/user_add.html',
 	       controller: 'app.user_add',
 	     },
		'backbutton@app.user_add':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.user_add':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.user_add.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/user_add/process/process.html',
 	       controller: 'app.user_add.process',
 	     },
		'backbutton@app.user_add.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.user_add.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 },
	    params:{
		newUser:{}
	    }
       })//REPLACE_ME


})
