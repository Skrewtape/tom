angular.module('app.tournamentselect_machine_add.machine_add',[]);
angular.module('app.tournamentselect_machine_add.machine_add').controller(
    'app.tournamentselect_machine_add.machine_add',
    function($scope, $http, $uibModal, $location, $state, Page, StatusModal,TimeoutResources) {
        

	$scope.division_id=$state.params.divisionId;

	StatusModal.loading();        
	$scope.division_promise = TimeoutResources.GetDivision(undefined,{division_id:$scope.division_id});        
        $scope.all_machines_promise = TimeoutResources.GetAllMachines($scope.division_promise);        
	$scope.all_machines_promise.then(function(data){
	    StatusModal.loaded();
            $scope.resources = TimeoutResources.GetAllResources();
	});
	$scope.machine_remove = function(division_machine_id){
	    StatusModal.loading();
	    $scope.removed_machine_promise = TimeoutResources.RemoveMachineFromDivision(undefined,
                                                         {division_machine_id:division_machine_id});
            $scope.division_promise = TimeoutResources.GetDivision($scope.removed_machine_promise,
                                                                  {division_id:$scope.division_id});
	    $scope.division_promise.then(function(data){
                $scope.resources = TimeoutResources.GetAllResources();
	        StatusModal.loaded();
	    });
	};
	$scope.machine_enable = function(division_machine_id){
	    StatusModal.loading();
	    $scope.enabled_machine_promise = TimeoutResources.EnableMachineInDivision(undefined,{division_machine_id:division_machine_id});
            $scope.division_promise = TimeoutResources.GetDivision($scope.enabled_machine_promise,{division_id:$scope.division_id});
	    $scope.division_promise.then(function(data){
                $scope.resources = TimeoutResources.GetAllResources();
		StatusModal.loaded();
	    });
	};
	$scope.machine_add = function(division_machine_id){
	    if($scope.selected_machine.name == undefined){
		return;
	    }
	    //FIXME : add check to make sure machine has not already been added
	    StatusModal.loading();
	    $scope.added_machine_promise = TimeoutResources.AddMachineToDivision(undefined,{division_id:$scope.division_id,machine_id:$scope.selected_machine.machine_id});
	    $scope.division_promise = TimeoutResources.GetDivision($scope.added_machine_promise,{division_id:$scope.division_id});            
            $scope.division_promise.then(function(data){                
                $scope.resources = TimeoutResources.GetAllResources();
	        $scope.selected_machine = undefined;
                StatusModal.loaded();
            });
            
	};	
    }
);
