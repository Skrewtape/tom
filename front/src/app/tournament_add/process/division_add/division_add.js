angular.module('app.tournament_add.process.division_add',[]);
angular.module('app.tournament_add.process.division_add').controller(
    'app.tournament_add.process.division_add',
    function($scope, $http, $location, $state, Page, StatusModal, TimeoutResources) {
	$scope.tournament_id=$state.params.tournamentId;
	$scope.form_division = {tournament_id:$scope.tournament_id};
	StatusModal.loading();
	$scope.tournament = TimeoutResources.getTournamentResource().getTournament({tournament_id:$scope.tournament_id});	    

	$scope.tournament.$promise.then(function(data){
	    if($scope.tournament.divisions == undefined){
		$scope.tournament.divisions = [];
	    }
	    StatusModal.loaded();		
	})
	
	$scope.add_division = function(){
	    StatusModal.loading();
	    $scope.division = TimeoutResources.addDivisionResource().addDivision($scope.form_division);	    
	    $scope.tournament.divisions.push($scope.division);

	    $scope.division.$promise.then(function(data){
		StatusModal.loaded();
		$scope.form_division.name=undefined;
		$scope.form_division.number_of_scores_per_entry=undefined;		
	    })
	    
	}
    }
);
