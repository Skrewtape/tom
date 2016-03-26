app.controller(
    'scorekeeper_selectmachine_recordscore_void',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal, $filter) {
        $scope.entry_id=$state.params.entryId;
        Page.set_title('Scorekeeping');
	StatusModal.loading()
	$http.put('[APIHOST]/entry/'+$scope.entry_id+'/void',{},{timeout:5000}).success(function (data) {                
            $scope.player_machine_setModal.close();
	    StatusModal.loaded();
        });            

	//StatusModal.loading();
	//$scope.get_player();	
    })
