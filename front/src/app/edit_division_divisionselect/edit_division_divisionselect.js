angular.module('app.edit_division_divisionselect',['app.edit_division_divisionselect.edit_division',/*REPLACEMECHILD*/]);
angular.module('app.edit_division_divisionselect').controller(
    'app.edit_division_divisionselect',
    function($scope, $state, StatusModal, TimeoutResources) {
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
        StatusModal.loading();
	$scope.division_promise = TimeoutResources.GetAllDivisions();
        $scope.division_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
    }
);
