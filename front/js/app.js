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
require('angular-fcsa-number');
require('ng-focus-if');

app = angular.module(
	'TOMApp',
	[
	    'ui.bootstrap',
	    'ui.router',
            'ncy-angular-breadcrumb',
            'uiSwitch',
            'ngKeypad',
	    'ngAnimate',
	    'fcsa-number',
	    'focus-if'
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

app.directive('stringToNumber', function() {
    return {
	require: 'ngModel',
	link: function(scope, element, attrs, ngModel) {
	    ngModel.$parsers.push(function(value) {
		return '' + value;
	    });
	    ngModel.$formatters.push(function(value) {
		return parseFloat(value, 10);
	    });
	}
    };
});
// Close all modals when changing routes
app.run(function($rootScope, $uibModalStack) {
    $rootScope.$on('$routeChangeSuccess', function() {
        $uibModalStack.dismissAll();	
    });

    $rootScope.$on('$stateChangeStart',
		   function(event, toState, toParams, fromState, fromParams){
		       if($rootScope.displayBackButton == undefined){
			   $rootScope.displayBackButton = {};
		       }
		       $rootScope.displayBackButton.status = true;
		       console.log('poop');
		       console.log($rootScope.displayBackButton.status);
		       $rootScope.state_name = toState.name;
		   });
});

