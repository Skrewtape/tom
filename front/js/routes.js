/*global app*/
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

	$stateProvider.state(
        'home', {
            url: '/',
            views: {
                '@': {
                    templateUrl: 'home.html',
                    controller: 'IndexController',
                }
            },
            ncyBreadcrumb: {
                label: 'Home',
            },
	}).state(
        'home.playerlist', {
            url: 'players',
            views: {
                '@': {
                    templateUrl: 'playerlist.html',
                    controller: 'playerlist',
                }
            },
            ncyBreadcrumb: {
                label: 'Players',
            },
	}
	).state(
        'home.playerlist.playeredit', {
            url: '/edit/:playerId',
            views: {
                '@': {
                    templateUrl: 'playerlist.playeredit.html',
                    controller: 'playeredit',
                }
            },
            ncyBreadcrumb: {
                label: 'Edit Player',
            },
	}
	).state(
        'home.playerlist.playeredit.process', {
            url: '/process/tournamentId/:tournamentId/divisionId/:divisionId',
            views: {
                '@': {
                    templateUrl: 'playerlist.playeredit.process.html',
                    controller: 'playereditprocess',
                }
            },
            ncyBreadcrumb: {
                label: 'Edit Player',
            },
	}
	).state(
        'home.playerlist.entryedit', {
            url: '/edit/:playerId/entry',
            views: {
                '@': {
                    templateUrl: 'playerlist.entryedit.html',
                    controller: 'entryedit',
                }
            },
            ncyBreadcrumb: {
                label: 'Edit Entries',
            },
	}
	).state(
        'home.playeradd', {
            url: 'playeradd',
            views: {
                '@': {
                    templateUrl: 'playeradd.html',
                    controller: 'playeradd',
                }
            },
            ncyBreadcrumb: {
                label: 'Add Player',
            },
	}
	).state(
        'home.tournament', {
            url: 'tournament',
            views: {
                '@': {
                    templateUrl: 'tournament.html',
                    controller: 'tournament',
                }
            },
            ncyBreadcrumb: {
                label: 'Tournament List',
            },
	}).state(
        'home.tournament.division', {
            url: '/:tournament_name/division/:division_id',
            views: {
                '@': {
                    templateUrl: 'division.html',
                    controller: 'division',
                }
            },
            ncyBreadcrumb: {
                label: 'Division',
            },
	}).state(
        'home.ticket.purchase', {
            url: '/purchase/playerId/:playerId',
            views: {
                '@': {
                    templateUrl: 'ticket.purchase.html',
                    controller: 'ticketpurchase',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.ticket.playerselect', {
            url: '/playerselect',
            templateUrl: 'genericplayerselectticket.html',
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.ticket', {
            url: 'ticket',
            views: {
                '@': {
                    templateUrl: 'genericplayerselect.html',
                    controller: 'genericplayerselect',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	});
});
