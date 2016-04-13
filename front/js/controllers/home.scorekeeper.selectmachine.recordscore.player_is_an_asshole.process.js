app.controller(
    'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {
        Page.set_title('Player Left Early');

	$scope.player_id=$state.params.playerId;
	
	$scope.player_promise = $scope.get_player($scope.player_id);
	$scope.clear_machine($scope.player_id,$scope.player.machine.machine_id,$scope.player_promise);
	
    });
