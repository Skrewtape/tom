angular.module('app.tournament_add.process',['app.tournament_add.process.division_add']);
angular.module('app.tournament_add.process').controller(
    'app.tournament_add.process',
    function($rootScope, $scope, $http, $location, $state, Page, StatusModal, TimeoutResources) {
	$scope.tournament_info=$state.params.tournamentInfo;
	if($scope.checkForBlankParams($scope.tournament_info) == true){
	    return;
	}
	//FIXME : Need to check for empty params (i.e. page is reloaded)
        StatusModal.loading();
	var submit_data = angular.toJson($scope.tournament_info);
	$scope.tournament = TimeoutResources.addTournamentResource().addTournament(submit_data);	    
	$scope.tournament.$promise.then(function(data){
	    StatusModal.loaded();		
	})        
    }
);
