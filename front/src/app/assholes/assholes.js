angular.module('app.assholes',[/*REPLACEMECHILD*/]);
angular.module('app.assholes').controller(
    'app.assholes',
    function($scope, $state, StatusModal, TimeoutResources) {
        StatusModal.loading();
	$scope.asshole_promise = TimeoutResources.GetAssholes();
        $scope.asshole_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
        
    }
);
