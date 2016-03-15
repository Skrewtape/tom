app.controller(
    'scorekeeper_selectmachine_recordscore',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal, $filter) {
        $scope.player_id=$state.params.playerId;
	$scope.machine_id=$state.params.machineId;
	$scope.division_id=$state.params.divisionId;

	$scope.get_machines = function(){
            $http.get('[APIHOST]/machine').success(
                function(data) {                    
                    $scope.machines = data;
		    StatusModal.loaded();
                }
            );	    
	}
	$scope.get_machine = function(){
            $http.get('[APIHOST]/machine/'+$scope.machine_id).success(
                function(data) {                    
                    $scope.machine = data;
		    $scope.get_machines()
                }
            );
        };
	
	$scope.get_player_active_entries = function(){
	    $http.get("[APIHOST]/player/"+$state.params.playerId+'/entry/active').success(
		function(data){
		    for (i in data[$scope.division_id]){
			$scope.player_active_entry = data[$scope.division_id][i];
		    }
		    $scope.get_machine();		    
		});                                	    
	};
	$scope.get_player = function(){
            $http.get('[APIHOST]/player/'+$scope.player_id).success(
                function(data) {                    
		    $scope.player = data;
		    $scope.get_player_active_entries();
                }
            );
        };

	StatusModal.loading();
	$scope.get_player();	
    })
