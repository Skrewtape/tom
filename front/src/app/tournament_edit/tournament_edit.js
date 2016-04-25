angular.module('app.tournament_edit',['app.tournament_edit.machine_add']);
angular.module('app.tournament_edit').controller(
    'app.tournament_edit',
    function($scope, $http, $uibModal, $location, $state, Page, StatusModal,TimeoutResources) {
	StatusModal.loading();	
	$scope.tournaments = TimeoutResources.getTournamentsResource().getTournaments();	    	
	$scope.tournaments.$promise.then(function(data){
	    StatusModal.loaded();
	})        

    }
);
