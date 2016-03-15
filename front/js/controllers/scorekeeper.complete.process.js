app.controller(
    'scorekeeper_complete_process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal, $filter) {
	$scope.entry_id = $state.params.entryId;

	//possible errors : 400, 500, 409
	$scope.complete_entry = function(){
            $http.put('[APIHOST]/entry/'+$scope.entry_id+'/complete').success(
                function(data) {                    
		    $scope.entry = data;
		    StatusModal.loaded();
                }
            );
        };
	
	StatusModal.loading();
	$scope.complete_entry();	
    })
