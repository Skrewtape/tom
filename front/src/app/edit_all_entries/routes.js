angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.edit_all_entries', 
        { 
 	 url: '/edit_all_entries',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/edit_all_entries/edit_all_entries.html',
 	       controller: 'app.edit_all_entries',
 	     },
		'backbutton@app.edit_all_entries':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.edit_all_entries':{
		templateUrl: 'shared_html/not_backbutton.html'
		},
             'edit_entries@app.edit_all_entries': {
                 templateUrl: 'shared_html/edit_entries.html',
             }
 	   }
       })//REPLACE_ME

})
