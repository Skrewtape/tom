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
 	 url: '/recordscore_scorekeeper/:divisionMachineId/teamId/:teamId/playerId/:playerId',
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
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo', 
        { 
 	 url: '/undo',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/playerselect_scorekeeper/process/undo/undo.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo',
 	     }
 	 },
	    params : {
		undoPlayerId:{}
	    }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm', 
        { 
 	 url: '/confirm/:score',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/confirm/confirm.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm',
 	     }
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/confirm/process/process.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process',
 	     }
 	 },
	    params : {
		finalScore: {}
	    }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete', 
        { 
 	 url: '/complete/:entryId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/confirm/process/complete/complete.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete',
 	     }
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/confirm/process/complete/process/process.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process',
 	     }
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void', 
        { 
 	 url: '/void',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/void/void.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void',
 	     }
 	 },
	    params:{
		entryId:{}
	    }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.void', 
        { 
 	 url: '/void',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/confirm/process/complete/void/void.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.void',
 	     }
 	   }
       })//REPLACE_ME













})
