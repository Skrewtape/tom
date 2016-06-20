angular.module('app.metadivision_add',['app.metadivision_add.process',/*REPLACEMECHILD*/]);
angular.module('app.metadivision_add').controller(
    'app.metadivision_add',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.new_metadivision = {divisions:{},metadivision_name:undefined}
	StatusModal.loading();
	$scope.divisions_promise = TimeoutResources.GetAllDivisions();
	//$scope.divisions_promise = TimeoutResources.GetAllTournaments();
	$scope.divisions_promise.then(function(data){
	    StatusModal.loaded();
	    $scope.resources = TimeoutResources.GetAllResources();
	})
    }
);
