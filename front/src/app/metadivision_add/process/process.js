angular.module('app.metadivision_add.process',[/*REPLACEMECHILD*/]);
angular.module('app.metadivision_add.process').controller(
    'app.metadivision_add.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.new_metadivision=$state.params.newMetadivision;
	if($scope.checkForBlankParams($scope.new_metadivision) == true){
	    return;
	}
        StatusModal.loading()
	$new_metadivision_promise = TimeoutResources.AddMetadivision(undefined,undefined,$scope.new_metadivision);
	$new_metadivision_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded()
	})
    }
);
