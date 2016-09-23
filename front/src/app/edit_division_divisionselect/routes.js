angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.edit_division_divisionselect', 
        { 
 	 url: '/edit_division_divisionselect',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/edit_division_divisionselect/edit_division_divisionselect.html',
 	       controller: 'app.edit_division_divisionselect',
 	     },
             'backbutton@app.edit_division_divisionselect':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.edit_division_divisionselect':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.edit_division_divisionselect.edit_division', 
        { 
 	 url: '/edit_division/:division_id',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/edit_division_divisionselect/edit_division/edit_division.html',
 	       controller: 'app.edit_division_divisionselect.edit_division',
 	     },
             'backbutton@app.edit_division_divisionselect.edit_division':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.edit_division_divisionselect.edit_division':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       })//REPLACE_ME


})
