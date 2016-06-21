//killroy was here
angular.module('app.tournament_add.process.division_add',[]);
angular.module('app.tournament_add.process.division_add').controller(
    'app.tournament_add.process.division_add',
    function($scope, $state, StatusModal, TimeoutResources, $q) {
	$scope.tournament_id=$state.params.tournamentId;
	$scope.form_division = {tournament_id:$scope.tournament_id};
	StatusModal.loading();
        $scope.tom_config_promise = TimeoutResources.GetTomConfig();
	$scope.tournament_promise = TimeoutResources.GetTournament($scope.tom_config_promise,{tournament_id:$scope.tournament_id});
	$scope.tournament_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
            //Bluergh - need to add this so the shared html ui-view works
            $scope.tournament = $scope.resources.tournament;
	    StatusModal.loaded();
	});
	
	$scope.add_division = function(){
	    StatusModal.loading();
            if($scope.resources.tom_config.use_stripe == false){
                $scope.stripe_sku = "doesnotexist";
                deferred_promise =$q.defer();
                deferred_promise.resolve({});
                $scope.sku_promise = deferred_promise.promise;                
            } else {
                $scope.stripe_sku = $scope.form_division.stripe_sku;
                $scope.sku_promise = TimeoutResources.GetSku(undefined,{sku:$scope.stripe_sku});                
            }
            
            
            $scope.sku_promise.then(function(data){
                if(data.sku != undefined || $scope.resources.tom_config.use_stripe == false){
                    return TimeoutResources.AddDivision(undefined,undefined,$scope.form_division);	    
                } else {
                    StatusModal.problemModal("You did not enter a valid SKU.  Try again...");                    
                }
            }).then(function(data){
		StatusModal.loaded();
                if(data == undefined){
                    return;
                }
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
