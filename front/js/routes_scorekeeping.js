app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state(
        'home.scorekeeper', {
            url: 'scorekeeper',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.html',
                    controller: 'scorekeeper',
                }
            }
	}).state(
        'home.scorekeeper.selectmachine', {
            url: '/selectmachine/division/:divisionId/tournament/:tournamendId',
            views: {
                '@': {
                    templateUrl: 'scorekeeper.selectmachine.html',
                    controller: 'scorekeeperselectmachine',
                }
            }
	})
})
