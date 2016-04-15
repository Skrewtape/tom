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
//require('ng-focus-if');

app = angular.module(
	'TOMApp',
	[
	    'ui.bootstrap',
	    'ui.router',
	    'tom_services'
	]
);

app.controller(
    'LoginController',
    function($scope, $http, $uibModal, $location, $state, Page, StatusModal) {
        $scope.data = {};
        $scope.login = function() {
	    StatusModal.loading();            
            $http.put('[APIHOST]/login', $scope.data,{timeout:5000}).success(
                function(put_data) {                                        
                    $http.get('[APIHOST]/user/current',{timeout:5000}).success(function (data) {
                        console.log('logged in');
                        StatusModal.loaded();
                        Page.set_logged_in_user(data);			
			$state.go('home');
                    })
                }
            )
        };
    }
);

app.controller(
    'IndexController',    
    function($scope, $location, $http, 
             $state, $injector, $uibModal, Page, StatusModal) {
	$scope.Page = Page;
        $scope.logout = function() {
	    StatusModal.loading();            	    
	    $http.put('[APIHOST]/logout',{},{timeout:5000}).success(
		function() {		    
		    Page.set_logged_in_user({});
		    $state.go('home');
		    StatusModal.loaded();            
		}
	    )
	};

        $http.get('[APIHOST]/user/current',{timeout:5000}).success(function (data) {
            Page.set_logged_in_user(data);			
        });
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

app.factory('myHttpInterceptor', function($q,$injector) {
    return {
	'responseError': function(rejection) {
	    var StatusModal = $injector.get('StatusModal');
	    StatusModal.loaded();
	    if(rejection.status == -1){
		rejection.data={};
		rejection.data.message="HTTP Timeout while getting "+rejection.config.url
	    }
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


