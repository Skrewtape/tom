angular.module('app.tournamentselect_machine_add',['app.tournamentselect_machine_add.machine_add']);
angular.module('app.tournamentselect_machine_add').controller(
    'app.tournamentselect_machine_add',
    function($scope, $http, $uibModal, $location, $state, Page, StatusModal,TimeoutResources) {
	StatusModal.loading();	
	$scope.tournaments = TimeoutResources.getAllTournamentsResource().getAllTournaments();	    	
	$scope.tournaments.$promise.then(function(data){
	    StatusModal.loaded();
	})        

    }
);
