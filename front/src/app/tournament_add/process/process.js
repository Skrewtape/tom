//killroy was here
angular.module('app.tournament_add.process',['app.tournament_add.process.division_add']);
angular.module('app.tournament_add.process').controller(
    'app.tournament_add.process',
    function($scope, $state, StatusModal, TimeoutResources,$stateParams, $q) {       
        $scope.tournament_info=$state.params.tournamentInfo;

        $scope.tournament_info.start_date = (new Date()).getTime();
        $scope.tournament_info.end_date = (new Date()).getTime();
        
        $scope.use_stripe=$state.params.useStripe;        
        //FIXME : it's possible to double submit a tournament by using the browser back button from the add_division page
        
        if($scope.checkForBlankParams($scope.tournament_info) == true){
	    return;
	}
        StatusModal.loading();
        
	var submit_data = angular.toJson($scope.tournament_info);
        if($scope.tournament_info.stripe_sku == undefined){
            $scope.stripe_sku = "doesnotexist";            
        } else {
            $scope.stripe_sku = $scope.tournament_info.stripe_sku;
        }
        //Bleh - we're gonna do some weird contorting here - need to make a seperate "process" for single division and multiple division
        if($scope.use_stripe){
            $scope.sku_promise = TimeoutResources.GetSku(undefined,{sku:$scope.stripe_sku});
        } else {            
            deferred_promise =$q.defer();
            deferred_promise.resolve({});
            $scope.sku_promise = deferred_promise.promise;
        }        
        $scope.sku_promise.then(function(data){
            console.log($scope.tournament_info);
            if(data.sku != undefined || $scope.tournament_info.single_division == false ||
               $scope.tournament_info.single_division == undefined || $scope.use_stripe == false){
	         return TimeoutResources.AddTournament(undefined,undefined,submit_data);
             } else {
                 StatusModal.goBackOnProblem("You did not enter a valid SKU.  Try again.");
             }
            
        }).then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    StatusModal.loaded();		
	});        
    }
);
