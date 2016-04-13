app.controller(
    'home.scorekeeper.selectmachine.recordscore.player_is_an_asshole',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {
        Page.set_title('Player Left Early');

	$scope.player_id=$state.params.playerId;	

	$scope.get_player($scope.player_id);			       
	
    });
