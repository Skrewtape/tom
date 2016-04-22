/*global angular:true, app:true, _:true*/
//angular = require('./lib/angular-index.js');

//poop
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
require('angular-resource');
//require('ng-focus-if');
//require('mobile-angular-ui');
app = angular.module(
	'TOMApp',
	[
	    'ui.bootstrap',
	    'ui.router',
	    'mobile-angular-ui',
	    'tom_services',
	    'app.login',
	    'app.tournament_add'
	]
);

app.controller(
    'IndexController',    
    function($scope, $location, $http, 
             $state, $injector, $uibModal, Page, StatusModal) {
	$scope.Page = Page;

	$scope.checkForBlankParams = function(param){
	    console.log(param);

	    if(Object.keys(param).length === 0 && JSON.stringify(param) === JSON.stringify({})){
		StatusModal.http_error("Oops.  Looks like you tried to reload a page which submits data.  That is a no no!");	         return true;
	    }
	}
	//FIXME : change this to use $resource	
        $scope.logout = function() {
	    StatusModal.loading();            	    
	    $http.put('[APIHOST]/logout',{},{timeout:5000}).success(
		function() {		    
		    Page.set_logged_in_user({});
		    $state.go('app');
		    StatusModal.loaded();            
		}
	    )
	};

	//FIXME : change this to use $resource
	if(Page.logged_in_user().username == undefined){
	    console.log('getting current user');
            $http.get('[APIHOST]/user/current',{timeout:5000}).success(function (data) {
		Page.set_logged_in_user(data);			
            });
	}
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

app.factory('myHttpInterceptor', function($q,$injector,$rootScope) {
    return {
	'responseError': function(rejection) {
	    var StatusModal = $injector.get('StatusModal');
	    console.log('got a bad http');
	    if(rejection.status == -1){
		rejection.data={};
		rejection.data.message="HTTP Timeout while getting "+rejection.config.url
	    }
	    $rootScope.loading = false;
	    StatusModal.http_error(rejection.data.message);	    
	    return $q.reject(rejection);
	}
    };
});

app.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('myHttpInterceptor');
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
//    $rootScope.$on('$routeChangeSuccess', function() {
//        $uibModalStack.dismissAll();	
//    });
    $rootScope.$on('$stateChangeStart', function(){
	$rootScope.$broadcast('$routeChangeSuccess');
//	$rootScope.broadcast('$routeChangeStart');
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


