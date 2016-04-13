app.controller(
    'home.godplayersearch.deactivate_player',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        $scope.player_id = $state.params.playerId;
	StatusModal.loading('home.godplayersearch.deactivate_player.js - getting player');
	$scope.get_player_promise = $scope.get_player($scope.player_id);
	$scope.get_player_promise.then(function(){
	    StatusModal.loaded();
	})
    })
