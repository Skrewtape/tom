angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.finals_activate', 
        { 
 	 url: '/finals_activate',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finals_activate/finals_activate.html',
 	       controller: 'app.finals_activate',
 	     },
		'backbutton@app.finals_activate':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.finals_activate':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.finals_activate.playerselect', 
        { 
 	 url: '/playerselect/:divisionId/:finalsPlayerSelectionType/:finalsNumberQualifiers/:finalsNumPlayersPerGroup/:finalsNumGamesPerMatch/:finalsNumberQualifiersA/:finalsNumberQualifiersB',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finals_activate/playerselect/playerselect.html',
 	       controller: 'app.finals_activate.playerselect',
 	     },
             'backbutton@app.finals_activate.playerselect':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.finals_activate.playerselect':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	   }
       }).state('app.finals_activate.playerselect.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/finals_activate/playerselect/process/process.html',
 	       controller: 'app.finals_activate.playerselect.process',
 	     },
             'backbutton@app.finals_activate.playerselect.process':{
               templateUrl: 'shared_html/backbutton.html'
             },
             'not_backbutton@app.finals_activate.playerselect.process':{
               templateUrl: 'shared_html/not_backbutton.html'
             }
 	 },
            params:{
                checkedPlayers:{}
            }
       })//REPLACE_ME



})
