angular.module('app.player_see_queue.division_machines',['app.player_see_queue.division_machines.queue',/*REPLACEMECHILD*/]);
angular.module('app.player_see_queue.division_machines').controller(
    'app.player_see_queue.division_machines',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.division_id=$state.params.divisionId;

        StatusModal.loading();
        $scope.queue_promise = TimeoutResources.GetDivisionQueue(undefined,{division_id:$scope.division_id});
        $scope.division_promise = TimeoutResources.GetDivision($scope.queue_promise,{division_id:$scope.division_id});
        $scope.division_promise.then(function(data){            
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();          
        })        
    }
);
