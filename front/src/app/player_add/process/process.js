angular.module('app.player_add.process',['app.player_add.process.edit_linked_division']);
angular.module('app.player_add.process').controller(
    'app.player_add.process',
    function($rootScope, $scope, $http, $location, $state, Page, StatusModal, TimeoutResources) {
	$scope.player_info=$state.params.newPlayerInfo;
	if($scope.checkForBlankParams($scope.player_info) == true){
	    return;
	}
        StatusModal.loading();
	var submit_data = angular.toJson($scope.player_info);
	$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
	$scope.player.$promise.then(function(data){
	    StatusModal.loaded();		
	})        
    }
);
