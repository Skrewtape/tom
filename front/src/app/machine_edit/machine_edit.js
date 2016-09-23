angular.module('app.machine_edit',[/*REPLACEMECHILD*/]);
angular.module('app.machine_edit').controller(
    'app.machine_edit',
    function($scope, $state, StatusModal, TimeoutResources) {
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
        StatusModal.loading();
	$scope.player_promise = TimeoutResources.GetAllDivisionMachines();
        $scope.player_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        })
        $scope.submit_abbreviation = function(division_machine){
            StatusModal.loading();
            var submit_data = angular.toJson(division_machine);
            $scope.update_promise = TimeoutResources.UpdateDivisionMachine(undefined,{division_machine_id:division_machine.division_machine_id},submit_data);
            $scope.update_promise.then(function(data){
                StatusModal.loaded();
            });
        }
    }
);
