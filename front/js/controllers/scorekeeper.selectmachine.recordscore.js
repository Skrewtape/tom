app.controller(
    'scorekeeper_selectmachine_recordscore',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal, $filter) {
	$scope.formatted_score = {};
	$scope.formatted_score.score = ' ';
        $scope.player_id=$state.params.playerId;
	$scope.machine_id=$state.params.machineId;
	$scope.division_id=$state.params.divisionId;
	$scope.disabledScoreKeeping = true;
        Page.set_title('Scorekeeping');
	
	$scope.get_machines = function(){
            $http.get('[APIHOST]/machine',{timeout:5000}).success(
                function(data) {                    
                    $scope.machines = data;
		    StatusModal.loaded();
                }
            );	    
	}
	$scope.get_machine = function(){
            $http.get('[APIHOST]/machine/'+$scope.machine_id,{timeout:5000}).success(
                function(data) {                    
                    $scope.machine = data;
		    $scope.get_machines()
                }
            );
        };
	
	$scope.get_player_active_entries = function(){
	    $http.get("[APIHOST]/player/"+$state.params.playerId+'/entry/active',{timeout:5000}).success(
		function(data){
		    for (i in data[$scope.division_id]){
			$scope.player_active_entry = data[$scope.division_id][i];
		    }
		    $scope.get_machine();		    
		});                                	    
	};
	$scope.get_player = function(){
            $http.get('[APIHOST]/player/'+$scope.player_id,{timeout:5000}).success(
                function(data) {                    
		    $scope.player = data;
		    $scope.get_player_active_entries();
                }
            );
        };
	$scope.formatNumber=function(num) {
	    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1")
	}
	
	$scope.onChange = function(){
	    $scope.formatted_score.score = $filter('number')($scope.new_score);
	    if($scope.new_score > 0){
		$scope.disabledScoreKeeping = false;
	    } else {
		$scope.disabledScoreKeeping = true;
	    }
	}

	StatusModal.loading();
	$scope.get_player();	
    })
