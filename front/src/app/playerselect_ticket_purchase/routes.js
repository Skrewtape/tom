angular.module('TOMApp').config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider.state('app.playerselect_ticket_purchase', 
        { 
 	 url: '/playerselect_ticket_purchase',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_ticket_purchase/playerselect_ticket_purchase.html',
 	       controller: 'app.playerselect_ticket_purchase',
 	     },
		'backbutton@app.playerselect_ticket_purchase':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.playerselect_ticket_purchase':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	   }
       }).state('app.playerselect_ticket_purchase.ticket_purchase', 
        { 
 	 url: '/ticket_purchase/:playerId',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_ticket_purchase/ticket_purchase/ticket_purchase.html',
 	       controller: 'app.playerselect_ticket_purchase.ticket_purchase',
 	     },
	     'backbutton@app.playerselect_ticket_purchase.ticket_purchase':{
		 templateUrl: 'shared_html/backbutton.html'
	     },
	     'not_backbutton@app.playerselect_ticket_purchase.ticket_purchase':{
		 templateUrl: 'shared_html/not_backbutton.html'
	     },
             'metadivision_select_widget@app.playerselect_ticket_purchase.ticket_purchase':{
                 templateUrl: 'shared_html/metadivision_select_widget.html'
             },
             'division_select_widget@app.playerselect_ticket_purchase.ticket_purchase':{
                 templateUrl: 'shared_html/division_select_widget.html'
             },
             'team_select_widget@app.playerselect_ticket_purchase.ticket_purchase':{
                 templateUrl: 'shared_html/team_select_widget.html'
             }
             
 	   }
       }).state('app.playerselect_ticket_purchase.ticket_purchase.process', 
        { 
 	 url: '/process',
 	 views: {
 	     '@': {
 	       templateUrl: 'app/playerselect_ticket_purchase/ticket_purchase/process/process.html',
 	       controller: 'app.playerselect_ticket_purchase.ticket_purchase.process',
 	     },
		'backbutton@app.playerselect_ticket_purchase.ticket_purchase.process':{
		templateUrl: 'shared_html/backbutton.html'
		},
		'not_backbutton@app.playerselect_ticket_purchase.ticket_purchase.process':{
		templateUrl: 'shared_html/not_backbutton.html'
		}
 	 },
	    params: {addedTokens:{}}
       })//REPLACE_ME
})
