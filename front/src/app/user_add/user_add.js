angular.module('app.user_add',['app.user_add.process',/*REPLACEMECHILD*/]);
angular.module('app.user_add').controller(
    'app.user_add',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.new_user = {roles:{}}
	StatusModal.loading()
	$scope.roles_promise = TimeoutResources.GetRoles();
	$scope.roles_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded()
	})
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
