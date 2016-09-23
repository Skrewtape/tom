/*global angular:true, app:true, _:true*/
//angular = require('./lib/angular-index.js');

//poop
_ = require('underscore/underscore-min.js');
//_ = require('underscore');
angular = require('angular');
//require('jquery-browserify');
require('angular-ui-bootstrap');
require('angular-ui-router/release/angular-ui-router.min.js');
//require('angular-ui-router');
//require('bootstrap-sass/assets/javascripts/bootstrap');
//require('angular-fcsa-number');
require('angular-resource/angular-resource.min.js');
//require('angular-resource');
//require('ng-focus-if');
app = angular.module(
	'TOMApp',
	[
 	    'ui.bootstrap',
 	    'ui.router',
 	    'mobile-angular-ui',
 	    'tom_services',
 	    'tom_directives',
 	    'app.login',
// //	    'focus-if',
 	    'app.tournament_add',
 	    'app.tournamentselect_machine_add',
 	    'app.player_add',
// //	    'fcsa-number',
 	    'app.tournament_activate',
 	    'app.playerselect_ticket_purchase',
 	    'app.teamname_team_add',
 	    'app.playerlist',
 	    'app.playerselect_player_edit',
 	    'app.metadivision_add',
 	    'app.user_add',
 	    'app.playerselect_player_info',
 	    'app.tournamentselect_scorekeeper',
             'app.finalselect_finals',
             'app.finals_activate',
             'app.assholes',
             'app.edit_all_entries',
             'app.player_purchasetickets',
             'app.test','app.remove_player','app.machine_edit',/*REPLACEMECHILD*/
	]
);

app.controller(
    'IndexController',    
    function($scope, $location, $http, 
             $state, Page, StatusModal) {
	$scope.Page = Page;

        //FIXME : wipeStateParamToPreventRepost is a hack, and should be handled at the
        //        REST level
	$scope.checkForBlankParams = function(param){            
	    if(/*Object.keys(param).length === 0 &&*/ JSON.stringify(param) === JSON.stringify({})){
		StatusModal.http_error("Oops.  Looks like you tried to reload a page which submits data.  That is a no no!");	         return true;
	    }
	}
	$scope.launchVoidModal = function(resources,type){
	    StatusModal.launchVoidModal(resources,type)
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
            $http.get('[APIHOST]/user/current',{timeout:5000}).success(function (data) {
		Page.set_logged_in_user(data);			
            });
	}
    }
);

app.controller(
    'PlayerController',    
    function($scope, $location, $http, 
             $state, $injector, Page, StatusModal) {
	$scope.Page = Page;

        //FIXME : wipeStateParamToPreventRepost is a hack, and should be handled at the
        //        REST level
	$scope.checkForBlankParams = function(param){

	    if(Object.keys(param).length === 0 && JSON.stringify(param) === JSON.stringify({})){
		StatusModal.http_error("Oops.  Looks like you tried to reload a page which submits data.  That is a no no!");	         return true;
	    }
	}
	
	//FIXME : change this to use $resource	
        $scope.logout = function() {
	    StatusModal.loading();            	    
	    $http.put('[APIHOST]/logout',{},{timeout:5000}).success(
		function() {		    
		    Page.set_logged_in_player({});
		    $state.go('app');
		    StatusModal.loaded();            
		}
	    )
	};

	//FIXME : change this to use $resource
	if(Page.logged_in_player().first_name == undefined){
            $http.get('[APIHOST]/player/current',{timeout:5000}).success(function (data) {
		Page.set_logged_in_player(data);			
            });
	}
    }
);


app.factory('myHttpInterceptor', function($q,$injector,$rootScope) {
    return {
	'responseError': function(rejection) {
	    var StatusModal = $injector.get('StatusModal');
	    if(rejection.status == -1){
		rejection.data={};
		rejection.data.message="HTTP Timeout while getting "+rejection.config.url
	    }
	    $rootScope.loading = false;
	    console.log(rejection.data)
	    StatusModal.http_error(rejection.data.message, rejection.data.state_go);	    
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
app.run(function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function(){
	$rootScope.broadcast('$stateChangeStart');
    });
    //    $rootScope.$on('$routeChangeSuccess', function() {
    //        $uibModalStack.dismissAll();	
    //    });
    
    //// $rootScope.$on('$stateChangeStart', function(){
    //// 	$rootScope.$broadcast('$routeChangeSuccess');
    //// });

    // $rootScope.$on('$stateChangeStart',
    // 		   function(event, toState, toParams, fromState, fromParams){
    // 		       if($rootScope.displayBackButton == undefined){
    // 			   $rootScope.displayBackButton = {};
    // 		       }
    // 		       $rootScope.displayBackButton.status = true;
    // 		       $rootScope.state_name = toState.name;
    // 		   });
});

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
});

app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
      angular.forEach(items, function(item,index) {
          if(index == "$promise" || index == "$resolved"){
              
          } else {
              filtered.push(item);
          }
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

