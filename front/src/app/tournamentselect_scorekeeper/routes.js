angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.tournamentselect_scorekeeper', 
        { 
 	 url: '/tournamentselect_scorekeeper',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/tournamentselect_scorekeeper.html',
 	       controller: 'app.tournamentselect_scorekeeper',
 	     }
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper', 
        { 
 	 url: '/machineselect_scorekeeper/:divisionId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/machineselect_scorekeeper.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper',
 	     }
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper', 
        { 
 	 url: '/playerselect_scorekeeper/:divisionMachineId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/playerselect_scorekeeper/playerselect_scorekeeper.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper',
 	     }
 	 }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper', 
        { 
 	 url: '/recordscore_scorekeeper',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/recordscore_scorekeeper.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper',
 	     }
 	 }	   
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/playerselect_scorekeeper/process/process.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',
 	     }
 	 },
	    params: {
		playerId:{}
	    }
       })//REPLACE_ME






})
