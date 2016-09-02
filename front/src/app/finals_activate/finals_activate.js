angular.module('app.finals_activate',['app.finals_activate.playerselect',/*REPLACEMECHILD*/]);
angular.module('app.finals_activate').controller(
    'app.finals_activate',
    function($scope, $state, StatusModal, TimeoutResources) {
	StatusModal.loading()
	$scope.finals_state = {}
        $scope.check_division_finals_exist = function(division_id){
            for (final in $scope.resources.finals){
                if($scope.resources.finals[final].division_id == division_id){
                    return true;
                }
            }
            return false;
        }
	$scope.finals_promise = TimeoutResources.GetFinals();
	$scope.divisions_promise = TimeoutResources.GetAllDivisions($scope.finals_promise);
	$scope.divisions_promise.then(function(data){
	    StatusModal.loaded();
	    $scope.resources = TimeoutResources.GetAllResources();	    
	})
    }
);
