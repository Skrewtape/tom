angular.module('app.tournament_edit.machine_add',[]);
angular.module('app.tournament_edit.machine_add').controller(
    'app.tournament_edit.machine_add',
    function($scope, $http, $uibModal, $location, $state, Page, StatusModal,TimeoutResources) {
	StatusModal.loading();

	$scope.division_id=$state.params.divisionId;
	$scope.tournament_name=$state.params.tournamentName;
	$scope.single_division=$state.params.singleDivision;	

	$scope.division = TimeoutResources.getDivisionResource().getDivision({division_id:$scope.division_id});	    	

	$scope.all_machines_promise = $scope.division.$promise.then(function(data){
	    $scope.all_machines = TimeoutResources.getAllMachinesArrayResource().getAllMachinesArray();	    	
	})
	$scope.all_machines_promise.then(function(data){
	    StatusModal.loaded();
	})
	$scope.machine_remove = function(division_machine_id){
	    StatusModal.loading();
	    $scope.removed_machine = TimeoutResources.removeMachineFromDivisionResource().removeMachineFromDivision({division_machine_id:division_machine_id});
	    $scope.division_promise = $scope.removed_machine.$promise.then(function(data){
		$scope.division = TimeoutResources.getDivisionResource().getDivision({division_id:$scope.division_id});	    	
	    })
	    $scope.division_promise.then(function(data){
		StatusModal.loaded();
	    })
	}
	$scope.machine_enable = function(division_machine_id){
	    StatusModal.loading();
	    $scope.enabled_machine = TimeoutResources.enableMachineInDivisionResource().enableMachineInDivision({division_machine_id:division_machine_id});
	    $scope.division_promise = $scope.enabled_machine.$promise.then(function(data){
		$scope.division = TimeoutResources.getDivisionResource().getDivision({division_id:$scope.division_id});	    	
	    })
	    $scope.division_promise.then(function(data){
		StatusModal.loaded();
	    })


	    
	}
	$scope.machine_add = function(division_machine_id){
	    if($scope.selected_machine.name == undefined){
		return;
	    }
	    if($scope.division.machines == undefined){
		$scope.division.machines = [];
	    }	    
	    //FIXME : add check to make sure machine has not already been added
	    StatusModal.loading();
	    $scope.added_machine = TimeoutResources.addMachineToDivisionResource().addMachineToDivision({division_id:$scope.division_id,machine_id:$scope.selected_machine.machine_id});
	    $scope.added_machine.$promise.then(function(data){
		StatusModal.loaded();
	    });
	    $scope.division.machines.push($scope.added_machine);
	    $scope.selected_machine = undefined;
	}	
    }
);
