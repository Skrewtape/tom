//killroy was here
angular.module('app.tournament_add.process.division_add',[]);
angular.module('app.tournament_add.process.division_add').controller(
    'app.tournament_add.process.division_add',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.tournament_id=$state.params.tournamentId;
	$scope.form_division = {tournament_id:$scope.tournament_id};
	StatusModal.loading();
        $scope.tom_config_promise = TimeoutResources.GetTomConfig();
	$scope.tournament_promise = TimeoutResources.GetTournament($scope.tom_config_promise,{tournament_id:$scope.tournament_id});
	$scope.tournament_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();
	});
	
	$scope.add_division = function(){
	    StatusModal.loading();
	    $scope.division_promise = TimeoutResources.AddDivision(undefined,undefined,$scope.form_division);	    
	    $scope.division_promise.then(function(data){
		StatusModal.loaded();
		$scope.resources = TimeoutResources.GetAllResources();
		if($scope.resources.tournament.divisions == undefined){
	 	    $scope.resources.tournament.divisions = [];
		}	
		$scope.resources.tournament.divisions.push($scope.resources.add_division_result);		
		$scope.form_division.division_name=undefined;
		$scope.form_division.number_of_scores_per_entry=undefined;		
	    });	    
	};
    }
);
