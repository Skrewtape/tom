angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.edit_all_entries', 
        { 
 	 url: '/edit_all_entries',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/edit_all_entries/edit_all_entries.html',
 	       controller: 'app.edit_all_entries',
 	     }
 	   }
       })//REPLACE_ME

})
