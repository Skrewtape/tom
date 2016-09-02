angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.finalselect_finals', 
        { 
 	 url: '/finalselect_finals',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finalselect_finals/finalselect_finals.html',
 	       controller: 'app.finalselect_finals',
 	     },
		'backbutton@app.finalselect_finals':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.finalselect_finals':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.finalselect_finals.matchselect_finals', 
        { 
 	 url: '/matchselect_finals/:finalsExId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finalselect_finals/matchselect_finals/matchselect_finals.html',
 	       controller: 'app.finalselect_finals.matchselect_finals',
 	     },
		'backbutton@app.finalselect_finals.matchselect_finals':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.finalselect_finals.matchselect_finals':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 },            
            params: {
		tab_to_activate:{}
            }
       }).state('app.finalselect_finals.matchselect_finals.matchscores_finals', 
        { 
 	 url: '/matchscores_finals/:finalsMatchExId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finalselect_finals/matchselect_finals/matchscores_finals/matchscores_finals.html',
 	       controller: 'app.finalselect_finals.matchselect_finals.matchscores_finals',
 	     },
		'backbutton@app.finalselect_finals.matchselect_finals.matchscores_finals':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.finalselect_finals.matchselect_finals.matchscores_finals':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 },
            params: {
		round:{}
            }
       })//REPLACE_ME



})
