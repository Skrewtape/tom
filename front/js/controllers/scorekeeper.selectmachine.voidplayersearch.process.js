app.controller(
    'home_scorekeeper_selectmachine_voidplayersearch_process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal, $filter) {
        $scope.player_id=$state.params.playerId;
	$scope.division_id=$state.params.divisionId;
        Page.set_title('Void Player Entry');
	
	$scope.get_machines = function(){
            $http.get('[APIHOST]/machine',{timeout:5000}).success(
                function(data) {                    
		    console.log('found machines');
		    console.log(data);
                    $scope.machines = data;
		    StatusModal.loaded();
                }
            );	    
	}
	
	$scope.get_player_active_entries = function(){
	    $http.get("[APIHOST]/player/"+$state.params.playerId+'/entry/active',{timeout:5000}).success(
		function(data){
		    for (i in data[$scope.division_id]){
			$scope.player_active_entry = data[$scope.division_id][i];
		    }
		    console.log('found player active entry');
		    console.log($scope.player_active_entry);
		    $scope.get_machines();		    
		});                                	    
	};
	$scope.get_player = function(){
	    console.log('looking for  player');
            $http.get('[APIHOST]/player/'+$scope.player_id,{timeout:5000}).success(
                function(data) {                    
		    console.log('found player');
		    console.log(data);
		    $scope.player = data;
		    $scope.get_player_active_entries();
                }
            );
        };

	StatusModal.loading();
	$scope.get_player();	
    })
