angular.module('app.tournamentselect_machine_add',['app.tournamentselect_machine_add.machine_add']);
angular.module('app.tournamentselect_machine_add').controller(
    'app.tournamentselect_machine_add',
    function($scope, $http, $uibModal, $location, $state, Page, StatusModal,TimeoutResources) {
	StatusModal.loading();	
	$scope.tournaments_promise = TimeoutResources.GetAllTournaments();	    	
	$scope.tournaments_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();
	})        

    }
);
