/*global angular:true, app:true, _:true*/
//angular = require('./lib/angular-index.js');

_ = require('underscore');
angular = require('angular');
require('jquery-browserify');
require('angular-animate');
require('angular-ui-bootstrap');
require('angular-breadcrumb');
require('angular-touch');
require('angular-ui-router');
require('angular-ui-switch');
require('bootstrap-sass/assets/javascripts/bootstrap');
require('ngKeypad');

app = angular.module(
	'TOMApp',
	[
	    'ui.bootstrap',
	    'ui.router',
            'ncy-angular-breadcrumb',
            'uiSwitch',
            'ngKeypad',
	    'ngAnimate'	    
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
    $httpProvider.interceptors.push('myHttpInterceptor');
    $httpProvider.defaults.timeout = 5000;
});

// Close all modals when changing routes
app.run(function($rootScope, $uibModalStack) {
    $rootScope.$on('$routeChangeSuccess', function() {
        $uibModalStack.dismissAll();
    });
});

