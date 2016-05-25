// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var app = angular.module('MobileAngularUiExamples', [
  'mobile-angular-ui'
  
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and 
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like 
  // opening sidebars, turning switches on/off ..
  //'mobile-angular-ui.gestures'
]);
app.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.controller('MainController', function($rootScope, $scope, $window){
    $scope.new_machine = {data:'-1'}

    $scope.poop = function(){
	$window.location.href = '/results/division_machine/'+$scope.new_machine.data;
	console.log($scope.new_machine);
    }
})
