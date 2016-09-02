angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.player_purchasetickets', 
        { 
 	 url: '/player_purchasetickets/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_purchasetickets/player_purchasetickets.html',
 	       controller: 'app.player_purchasetickets',
 	     },
	     'backbutton@app.player_purchasetickets':{
		 templateUrl: 'shared_html/backbutton.html'
	     },
	     'not_backbutton@app.player_purchasetickets':{
		 templateUrl: 'shared_html/not_backbutton.html'
	     },
             'metadivision_select_widget@app.player_purchasetickets':{
                 templateUrl: 'shared_html/metadivision_select_widget.html'
             },
             'division_select_widget@app.player_purchasetickets':{
                 templateUrl: 'shared_html/division_select_widget.html'
             },
             'team_select_widget@app.player_purchasetickets':{
                 templateUrl: 'shared_html/team_select_widget.html'
             }
 	   }
       }).state('app.player_purchasetickets.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/player_purchasetickets/process/process.html',
 	       controller: 'app.player_purchasetickets.process',
 	     },
		'backbutton@app.player_purchasetickets.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.player_purchasetickets.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 },
            params: {addedTokens:{},stripeToken:{}}
       })//REPLACE_ME


})
