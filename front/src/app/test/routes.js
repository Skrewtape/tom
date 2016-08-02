angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.test', 
        { 
 	 url: '/test',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/test/test.html',
 	       controller: 'app.test',
 	     },
             'backbutton@app.test':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.test':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       })//REPLACE_ME

})
