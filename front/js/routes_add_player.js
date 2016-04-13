/*global app*/
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state(
        'home.playeradd.purchase_multiple_tickets', {
            url: '/purchase_tickets/playerId/:playerId',
            views: {
                '@': {
                    templateUrl: 'home.playeradd.purchase_multiple_tickets.html',
                    controller: 'home_playeradd_purchase-multiple-tickets',
                }
            }
	}).state(
        'home.playeradd.purchase_multiple_tickets.process', {
            url: '/process',
            views: {
                '@': {
                    templateUrl: 'home.playeradd.purchase_multiple_tickets.process.html',
                    controller: 'home_playeradd_purchase-multiple-tickets_process',
                },
		'purchase_multiple_tickets_process@home.playeradd.purchase_multiple_tickets.process': {
		    templateUrl: 'purchase_multiple_tickets-purchase_multiple_tickets.html'
		}
	    },
	    params: {
		ticketsPurchased: {}
	    }
	}).state(
        'home.playeradd.playeredit', {
            url: '/playeredit/:playerId',
            views: {
                '@': {
                    templateUrl: 'playerlist.playeredit.html',
                    controller: 'playeredit',
                }		
            }
	}).state(
        'home.playeradd.playeredit.process', 
	    {   url: '/process/tournamentId/:tournamentId/divisionId/:divisionId',
		views: {
		    '@': {
			templateUrl: 'playerlist.playeredit.process.html',
			controller: 'playereditprocess',
		    },
		    'playeredit@home.playeradd.playeredit.process' :{
			templateUrl: 'playeredit-purchase_multiple_tickets.html'
		    }
		},
	    }
	).state(
        'home.playeradd.purchase_multiple_tickets.playeredit', {
            url: '/multi_ticket_buy/playeredit',
            views: {
                '@': {
                    templateUrl: 'playerlist.playeredit.html',
                    controller: 'playeredit',
                }		
            }
	}).state(
        'home.playeradd.purchase_multiple_tickets.playeredit.process', 
	    {   url: '/multi_ticket_buy/process/tournamentId/:tournamentId/divisionId/:divisionId',
		views: {
		    '@': {
			templateUrl: 'playerlist.playeredit.process.html',
			controller: 'playereditprocess',
		    },
		    'playeredit@home.playeradd.purchase_multiple_tickets.playeredit.process' :{
			templateUrl: 'playeredit-purchase_multiple_tickets.html'
		    }
		},
	    }
	)
});

