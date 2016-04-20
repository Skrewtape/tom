angular.module('app.tournament_add.process',[]);
angular.module('app.tournament_add.process').controller(
    'app.tournament_add.process',
    function($rootScope, $scope, $http, $location, $state, Page, StatusModal, TimeoutResources) {
	$rootScope.loading=true;
	$scope.tournament_info=$state.params.tournamentInfo;
        StatusModal.loading();
	var submit_data = angular.toJson($scope.tournament_info);
	$scope.tournament = TimeoutResources.addTournamentResource().addTournament(submit_data);	    
	$scope.tournament.$promise.then(function(data){
	    StatusModal.loaded();		
	    $rootScope.loading=false;
	})        
    }
);
