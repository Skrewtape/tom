/*global angular:true, app:true, _:true*/
//angular = require('./lib/angular-index.js');

_ = require('underscore');
angular = require('angular');
require('jquery-browserify');
//require('angular-animate');
require('angular-ui-bootstrap');
//require('angular-breadcrumb');
//require('angular-touch');
require('angular-ui-router');
//require('angular-ui-switch');
require('bootstrap-sass/assets/javascripts/bootstrap');
//require('ngKeypad');
require('angular-fcsa-number');
//require('ng-focus-if');

app = angular.module(
	'TOMApp',
	[
	    'ui.bootstrap',
	    'ui.router'
	]
);

app.controller(
	'IndexController',    
    function($scope, $location, $http, 
             $state, $injector, $uibModal) {
        $scope.logout = function() {
	    $http.put('[APIHOST]/logout',{},{timeout:5000}).success(
		function() {
		    //FIXME : uh, should this be a blank object?
		    $location.path('/');
		}
	    )
	};

        $scope.login = function() {
            $scope.openModalWithController('login.html','LoginController');
	    
        };
        
        $http.get('[APIHOST]/user/current',{timeout:5000}).success(function (data) {
	    
        });

        $scope.openModalWithController = function(templateUrl, controller){
            return $uibModal.open({
                templateUrl: templateUrl,
		controller: controller,		
                backdrop: 'static',
                keyboard: false,
                scope: $scope                
            });            
	};

        $scope.openModalWithMessage = function(templateUrl,error_message){
	    $scope.error_message = error_message;
            return $uibModal.open({
                templateUrl: templateUrl,
                backdrop: 'static',
                keyboard: false,
                scope: $scope                
            });            
        };        	
    }
);


//require('./controllers/index.js');
//require('./factories/index.js');
// require('./directives/index.js');
// require('./routes.js');
// require('./routes_add_player.js');
// require('./routes_add_score.js');
// require('./routes_scorekeeping.js');
// require('./routes_scorekeeping_playerselect.js');
// require('./routes_godassholesearch.js');
// require('./routes_add_player.js');
// require('./routes_home.poop.js');

// Set up CORS stuff
app.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.interceptors.push('myHttpInterceptor');
});

// app.directive('stringToNumber', function() {
//     return {
// 	require: 'ngModel',
// 	link: function(scope, element, attrs, ngModel) {
// 	    ngModel.$parsers.push(function(value) {
// 		return '' + value;
// 	    });
// 	    ngModel.$formatters.push(function(value) {
// 		return parseFloat(value, 10);
// 	    });
// 	}
//     };
// });
// Close all modals when changing routes
app.run(function($rootScope, $uibModalStack) {
    $rootScope.$on('$routeChangeSuccess', function() {
        $uibModalStack.dismissAll();	
    });

    // $rootScope.$on('$stateChangeStart',
    // 		   function(event, toState, toParams, fromState, fromParams){
    // 		       if($rootScope.displayBackButton == undefined){
    // 			   $rootScope.displayBackButton = {};
    // 		       }
    // 		       $rootScope.displayBackButton.status = true;
    // 		       $rootScope.state_name = toState.name;
    // 		   });
});

