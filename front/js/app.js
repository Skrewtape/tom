/*global angular:true, app:true*/
angular = require('./lib/angular-index.js');

require('jquery-browserify');

require('angular-bootstrap');
require('angular-breadcrumb');
require('angular-touch');
require('angular-ui-router');
require('bootstrap-sass/assets/javascripts/bootstrap');

app = angular.module(
	'TOMApp',
	[
		'ui.bootstrap',
		'ui.router',
        'ncy-angular-breadcrumb',
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

