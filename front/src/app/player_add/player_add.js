angular.module('app.player_add',['app.player_add.process']);
angular.module('app.player_add').controller(
    'app.player_add',
    function($scope, $http, $location, $state, Page, StatusModal, TimeoutResources) {
	$scope.new_player = {};
    }
);
