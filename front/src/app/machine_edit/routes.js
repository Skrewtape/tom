angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.machine_edit', 
        { 
 	 url: '/machine_edit',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/machine_edit/machine_edit.html',
 	       controller: 'app.machine_edit',
 	     },
             'backbutton@app.machine_edit':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.machine_edit':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       })//REPLACE_ME

})
