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
        'home.playeradd.playeredit', {
            url: '/playeredit/playerId/:playerId',
            views: {
                '@': {
                    templateUrl: 'playerlist.playeredit.html',
                    controller: 'playeredit',
                }
            },
            ncyBreadcrumb: {
                label: 'Add Player',
            },
	}
	).state(
        'home.playeradd.playeredit.process', {
          url: '/process/tournamentId/:tournamentId/divisionId/:divisionId',
            views: {
                '@': {
                    templateUrl: 'playerlist.playeredit.process.html',
                    controller: 'playereditprocess',
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
        'home.ticket.process', {
            url: '/purchase/playerId/:playerId',
            views: {
                '@': {
                    templateUrl: 'ticket.process.html',
                    controller: 'ticket_process',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.ticket.process.selecttickets', {
            url: '/divisionId/:divisionId/divisionName/:divisionName/tournamentName/:tournamentName',
            views: {
                '@': {
                    templateUrl: 'ticket.process.selecttickets.html',
                    controller: 'ticket_process_selecttickets',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.ticket.process.selecttickets.process', {
            url: '/numEntrys/:numEntrys',
            views: {
                '@': {
                    templateUrl: 'ticket.process.selecttickets.process.html',
                    controller: 'ticket_process_selecttickets_process',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.ticket.process.playeredit', {
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
        'home.ticket.process.playeredit.process', {
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
        'home.ticket', {
            url: 'ticket/:pageTitle',
            views: {
                '@': {
                    templateUrl: 'genericplayerselect.html',
                    controller: 'genericplayerselect',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper', {
            url: 'scorekeeper',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.html',
                    controller: 'scorekeeper',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper.selectmachine', {
            url: '/selectmachine/division/:divisionId/tournament/:tournamendId',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.html',
                    controller: 'scorekeeperselectmachine',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper.selectmachine.genericplayerselect_selected', {
            url: '/playerselect/machineId/:machineId/pageTitle/:pageTitle',
            views: {
                '@': {
                    templateUrl: 'genericplayerselect.html',
                    controller: 'genericplayerselect',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper.selectmachine.genericplayerselect_selected.process', {
            url: '/playerId/:playerId/pageTitle/:pageTitle',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.genericplayerselect_selected.process.html',
                    controller: 'scorekeeper_selectmachine_genericplayerselect_selected_process',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper.selectmachine.recordscore', {
            url: '/recordscore/:machineId/playerId/:playerId',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.recordscore.html',
                    controller: 'scorekeeper_selectmachine_recordscore',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper.selectmachine.recordscore.void', {
            url: '/void/entryId/:entryId',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.recordscore.void.html',
                    controller: 'scorekeeper_selectmachine_recordscore_void',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper.selectmachine.recordscore.process', {
            url: '/entryId/:entryId/newScore/:newScore',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.recordscore.process.html',
                    controller: 'scorekeeper_selectmachine_recordscore_process',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper.selectmachine.complete', {
            url: '/playerId/:playerId/entryId/:entryId',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.complete.html',
                    controller: 'scorekeeper_complete',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper.selectmachine.complete.void', {
            url: '/void',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.complete.void.html',
                    controller: 'scorekeeper_complete_void',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'home.scorekeeper.selectmachine.complete.process', {
            url: '/process',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.complete.process.html',
                    controller: 'scorekeeper_complete_process',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'results_home', {
            url: '/results_home',
            views: {
                '@': {
                    templateUrl: 'results_home.html',
                    controller: 'results_home'
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'results_home.divisions', {
            url: '/divisions_results',
            views: {
                '@': {
                    templateUrl: 'results_home.divisions.html',
                    controller: 'results_home_divisions',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'results_home.divisions.results', {
            url: '/results/tournamentName/:tournamentName/divisionName/:divisionName/divisionId/:divisionId/results',
            views: {
                '@': {
                    templateUrl: 'results_home.divisions.results.html',
                    controller: 'results_home_divisions_results',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'results_home.machines', {
            url: '/machines_results',
            views: {
                '@': {
                    templateUrl: 'results_home.machines.html',
                    controller: 'results_home_machines',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
        'results_home.machines.results', {
            url: '/results/machineId/:machineId/machineName/:machineName/divisionId/:divisionId',
            views: {
                '@': {
                    templateUrl: 'results_home.machines.results.html',
                    controller: 'results_home_machines_results',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
            'results_home.players', {
            url: '/players_results',
            views: {
                '@': {
                    templateUrl: 'results_playerlist.html',
                    controller: 'playerlist',
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
            'home.playersearch', {
            url: 'playersearch',
            views: {
                '@': {
                    templateUrl: 'playerselect.html',
                    controller: 'genericplayerselect',
                },
		'player_info@home.playersearch': {
                    templateUrl: 'playerselect-player_info.html'
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
            'home.playersearch.results', {
            url: '/playerId/:playerId',
            views: {
                '@': {
                    templateUrl: 'results_home.players.results.html',
                    controller: 'results_home_players_results',
                },
		'tickets_in_progress@home.playersearch.results': {
                    templateUrl: 'entry_result.html',
                    controller: function($scope){
			$scope.title = "Tickets In Progress";
			$scope.display_entries = $scope.active_entries;
		    }           
                },
		'top_tickets@home.playersearch.results': {
                    templateUrl: 'entry_result.html',
                    controller: function($scope){
			$scope.title = "Top Tickets";
			$scope.orderBy = "rank";
			$scope.top_entry = true;
			$scope.display_entries = $scope.entries;
		    }           
                },
		'all_tickets@home.playersearch.results': {
                    templateUrl: 'entry_result.html',
                    controller: function($scope){
			$scope.title = "All Tickets";
			$scope.orderBy = "entry_id";
			$scope.display_entries = $scope.entries;
		    }           
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	}).state(
            'results_home.players.results', {
            url: '/results/playerId/:playerId',
            views: {
                '@': {
                    templateUrl: 'results_home.players.results.html',
                    controller: 'results_home_players_results',
                },
		'tickets_in_progress@results_home.players.results': {
                    templateUrl: 'entry_result.html',
                    controller: function($scope){
			$scope.title = "Tickets In Progress";
			$scope.display_entries = $scope.active_entries;
		    }           
                },
		'top_tickets@results_home.players.results': {
                    templateUrl: 'entry_result.html',
                    controller: function($scope){
			$scope.title = "Top Tickets";
			$scope.orderBy = "rank";
			$scope.top_entry = true;
			$scope.display_entries = $scope.entries;
		    }           
                },
		'all_tickets@results_home.players.results': {
                    templateUrl: 'entry_result.html',
                    controller: function($scope){
			$scope.title = "All Tickets";
			$scope.orderBy = "entry_id";
			$scope.display_entries = $scope.entries;
		    }           
                }
            },
            ncyBreadcrumb: {
                label: 'Ticket Purchase',
            },
	});
});
