app.controller(
    'home.godplayersearch.deactivate_player.process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        $scope.player_id = $state.params.playerId;
	StatusModal.loading('home.godplayersearch.deactivate_player.process.js - deactivating player');
	$scope.get_player_promise = $scope.get_player($scope.player_id);
	$scope.deactivate_player_promise = $scope.deactivate_player($scope.player_id,$scope.get_player_promise)
	$scope.deactivate_player_promise.then(function(){
	    console.log($scope.player);
	    StatusModal.loaded();
	})
    })
