angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.tournamentselect_scorekeeper', 
        { 
 	 url: '/tournamentselect_scorekeeper',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/tournamentselect_scorekeeper.html',
 	       controller: 'app.tournamentselect_scorekeeper',
 	     },
		'backbutton@app.tournamentselect_scorekeeper':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper', 
        { 
 	 url: '/machineselect_scorekeeper/divisionId/:divisionId/tournamentId/:tournamentId/teamTournament/:teamTournament',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/machineselect_scorekeeper.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper',
  	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper', 
        { 
 	 url: '/recordscore_scorekeeper/:divisionMachineId/teamId/:teamId/playerId/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/recordscore_scorekeeper.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 }	   
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm', 
        { 
 	 url: '/confirm/:score/entryId/:entryId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/confirm/confirm.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/confirm/process/process.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process':{
		templateUrl: 'shared_html/not_backbutton.html'
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
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/confirm/process/complete/process/process.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void', 
        { 
 	 url: '/void',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/void/void.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void':{
		templateUrl: 'shared_html/not_backbutton.html'
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
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.void':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm.process.complete.void':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper', 
        { 
 	 url: '/playerselect_scorekeeper/:divisionMachineId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/playerselect_scorekeeper/playerselect_scorekeeper.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/playerselect_scorekeeper/process/process.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 },
	    params: {
		playerId:{},
		team:{}
	    }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo', 
        { 
 	 url: '/undo',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/playerselect_scorekeeper/process/undo/undo.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 },
	    params : {
		undoPlayerId:{}
	    }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole', 
        { 
 	 url: '/entry/:entryId/asshole',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/asshole/asshole.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/tournamentselect_scorekeeper/machineselect_scorekeeper/recordscore_scorekeeper/asshole/process/process.html',
 	       controller: 'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process',
 	     },
		'backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 },
            params: {
                asshole:{}
            }
            
       })//REPLACE_ME















})
