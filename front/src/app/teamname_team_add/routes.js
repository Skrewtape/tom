angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.teamname_team_add', 
        { 
 	 url: '/teamname_team_add',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/teamname_team_add/teamname_team_add.html',
 	       controller: 'app.teamname_team_add',
 	     }
 	   }
       }).state('app.teamname_team_add.playeroneselect_team_add', 
        { 
 	 url: '/playeroneselect_team_add/teamName/:teamName',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/teamname_team_add/playeroneselect_team_add/playeroneselect_team_add.html',
 	       controller: 'app.teamname_team_add.playeroneselect_team_add',
 	     }
 	   }
       }).state('app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add', 
        { 
 	 url: '/playertwoselect_team_add/playerOneId/:playerOneId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/teamname_team_add/playeroneselect_team_add/playertwoselect_team_add/playertwoselect_team_add.html',
 	       controller: 'app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add',
 	     }
 	   }
       }).state('app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add', 
        { 
 	 url: '/review_team_add/playerTwoId/:playerTwoId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/teamname_team_add/playeroneselect_team_add/playertwoselect_team_add/review_team_add/review_team_add.html',
 	       controller: 'app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add',
 	     }
 	   }
       }).state('app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/teamname_team_add/playeroneselect_team_add/playertwoselect_team_add/review_team_add/process/process.html',
 	       controller: 'app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add.process',
 	     }
 	 },
	    params: {
		finalTeamName:{}
	    }
       })//REPLACE_ME





})
