//killroy was here
angular.module('app.tournament_add.process',['app.tournament_add.process.division_add']);
angular.module('app.tournament_add.process').controller(
    'app.tournament_add.process',
    function($scope, $state, StatusModal, TimeoutResources,$stateParams) {       
        $scope.tournament_info=$state.params.tournamentInfo;
        //FIXME : it's possible to double submit a tournament by using the browser back button from the add_division page
        
        if($scope.checkForBlankParams($scope.tournament_info) == true){
	    return;
	}
        StatusModal.loading();
	var submit_data = angular.toJson($scope.tournament_info);        
	$scope.add_tournament_promise = TimeoutResources.AddTournament(undefined,undefined,submit_data);		
	$scope.add_tournament_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();		
	})        
    }
);
