angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.assholes', 
        { 
 	 url: '/assholes',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/assholes/assholes.html',
 	       controller: 'app.assholes',
 	     },
             'backbutton@app.assholes':{
                 templateUrl: 'shared_html/backbutton.html'
             }
 	   }
       })//REPLACE_ME

})
