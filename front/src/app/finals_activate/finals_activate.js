angular.module('app.finals_activate',['app.finals_activate.playerselect',/*REPLACEMECHILD*/]);
angular.module('app.finals_activate').controller(
    'app.finals_activate',
    function($scope, $state, StatusModal, TimeoutResources) {
	StatusModal.loading()
	$scope.finals_state = {}	
	$scope.promise = TimeoutResources.GetFinals();
	$scope.finals_promise = TimeoutResources.GetAllTournaments($scope.promise);
	$scope.finals_promise.then(function(data){
	    StatusModal.loaded();
	    $scope.resources = TimeoutResources.GetAllResources();	    
	})
    }
);
