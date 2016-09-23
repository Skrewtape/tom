angular.module('app.edit_division_divisionselect.edit_division',[/*REPLACEMECHILD*/]);
angular.module('app.edit_division_divisionselect.edit_division').controller(
    'app.edit_division_divisionselect.edit_division',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.division_id=$state.params.division_id;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
        StatusModal.loading();
	$scope.division_promise = TimeoutResources.GetDivision(undefined,{division_id:$scope.division_id});
        $scope.division_promise.then(function(data){
            StatusModal.loaded();
            $scope.resources = TimeoutResources.GetAllResources();            
        });
        $scope.save_division = function(){
            StatusModal.loading();
	    $scope.division_promise = TimeoutResources.UpdateDivision(undefined,{division_id:$scope.division_id},$scope.resources.division);
            $scope.division_promise.then(function(data){
                StatusModal.loaded()
            });
        }
    }
);
