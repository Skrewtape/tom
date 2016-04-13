app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state(
        'home.scorekeeper.selectmachine.genericplayerselect_selected', {
            url: '/playerselect/machineName/:machineName/machineId/:machineId/pageTitle/:pageTitle',
            views: {
                '@': {
                    templateUrl: 'genericplayerselect.html',
                    controller: 'genericplayerselect',
                },
		'genericplayerselect_message@home.scorekeeper.selectmachine.genericplayerselect_selected': {
		    templateUrl: 'genericplayerselect-message.html'
		}
		
            }
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
	})
})
