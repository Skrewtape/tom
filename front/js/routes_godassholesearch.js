app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state(
        'home.godassholesearch', {
            url: 'godassholesearch',
            views: {
                '@': {
                    templateUrl: 'home.godassholesearch.html',
                    controller: 'home.godassholesearch',
                }
            }
	})
})
