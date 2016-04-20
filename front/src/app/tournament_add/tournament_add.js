angular.module('app.tournament_add',['app.tournament_add.process']);
angular.module('app.tournament_add').controller(
    'app.tournament_add',
    function($scope, $http, $location, $state, Page, StatusModal, TimeoutResources) {
	$scope.tournament = {};
    }
);
