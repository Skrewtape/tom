angular.module('app.user_add.process',[/*REPLACEMECHILD*/]);
angular.module('app.user_add.process').controller(
    'app.user_add.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.new_user=$state.params.newUser;
	if($scope.checkForBlankParams($scope.new_user) == true){
	    return;
	}

	StatusModal.loading()
	$scope.user_promise = TimeoutResources.AddUser(undefined,undefined,$scope.new_user);	    
	$scope.user_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded()
	})
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);	    
    }
);
