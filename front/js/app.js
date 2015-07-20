/*global angular:true, app:true*/
angular = require('./lib/angular-index.js');

require('angular-route');
require('angular-touch');
require('jquery-browserify');
require('bootstrap-sass/assets/javascripts/bootstrap');
require('angular-bootstrap');

app = angular.module(
	'TOMApp',
	[
		'ngRoute',
		'ui.bootstrap',
	]
);

require('./controllers/index.js');
require('./factories/index.js');
// require('./directives/index.js');
require('./routes.js');

// Set up CORS stuff
app.config(function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// Close all modals when changing routes
app.run(function($rootScope, $modalStack) {
    $rootScope.$on('$routeChangeSuccess', function() {
        $modalStack.dismissAll();
    });
});

