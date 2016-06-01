angular.module('app.finals_activate',[/*REPLACEMECHILD*/]);
angular.module('app.finals_activate').controller(
    'app.finals_activate',
    function($scope, $state, StatusModal, TimeoutResources) {
	StatusModal.loading()
	$scope.finals_state = {}	
	$scope.promise = TimeoutResources.GetFinals();
	$scope.finals_promise = TimeoutResources.GetAllTournaments($scope.promise);
	$scope.finals_promise.then(function(data){
	    StatusModal.loaded();
	    $scope.resources = TimeoutResources.GetAllResources();	    
	})
	$scope.start_finals = function(division_id){
	    StatusModal.loading()
	    $scope.add_finals_promise = TimeoutResources.AddFinals(undefined,{division_id:division_id});
	    $scope.add_finals_promise.then(function(data){
		finals_id=data.finals_id;
		$scope.gen_finals_promise = TimeoutResources.GenerateFinalsRounds($scope.add_finals_promise,{finals_id:finals_id});
		$scope.fill_finals_promise = TimeoutResources.FillFinalsRounds($scope.gen_finals_promise,{finals_id:finals_id});
		$scope.fill_finals_promise.then(function(data){
	     	    $scope.get_finals_promise = TimeoutResources.GetFinals();		
	     	    $scope.get_finals_promise.then(function(data){
	     		$scope.resources = TimeoutResources.GetAllResources();
			StatusModal.loaded();
	     	    })
		})
	    })
		
	}
    }
);
