app.controller(
    'scorekeeper_selectmachine_genericplayerselect_selected_process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal, $filter) {
        $scope.player_id=$state.params.playerId;
	$scope.machine_id=$state.params.machineId;
	$scope.division_id=$state.params.divisionId;
	$scope.displayBackButton.status = false;
	
	$scope.process_machine_select = function(){
            $http.put('[APIHOST]/machine/'+$scope.machine_id+'/player/'+$scope.player_id,{},{timeout:5000}).success(
                function(data) {                    
                    $scope.machine = data;
		    StatusModal.loaded();
                }
            );
	};
	
	$scope.get_machine = function(){
            $http.get('[APIHOST]/machine/'+$scope.machine_id,{timeout:5000}).success(
                function(data) {                    
                    $scope.machine = data;
		    $scope.process_machine_select();
                }
            );
        };

	$scope.check_for_double_dipping = function(player,scores,machine_id){
	    for(score_index in scores){
		console.log('debug');
		console.log(score_index + " " +scores[score_index].machine_id);
		if(scores[score_index].machine_id == machine_id){
		    error_message = player.first_name+' '+player.last_name+' has already played this game on this ticket!!';
		    $scope.openModalWithMessage('modals/error.html',error_message).closed.then(function(){
			$state.go('^.^');
		    })
		    return true;
		}
	    }
	    return false;
	};
	
	$scope.check_player_machine = function(player){
	    if(player.machine_id!=null){
		error_message = player.first_name+' '+player.last_name+' is already playing a game ('+player.machine.name+')!';
		console.log('error!');
		console.log(player);
		$scope.openModalWithMessage('modals/error.html',error_message).closed.then(function(){
		    $state.go('^.^');
		})
		return false;
	    }	    
	    return true;
	}
	
	$scope.check_player_open_entries = function(player_open_entries,player){
	    key_count = $scope.count_keys(player_open_entries);
	    if(key_count == 0 || player_open_entries[$scope.division_id] == undefined) {
		error_message = player.first_name+' '+player.last_name+' has no tickets in this tournament/division!';
		$scope.openModalWithMessage('modals/error.html',error_message).closed.then(function(){
		    $state.go('^.^');
		})
		return false;
	    }
	    return true
	}
	$scope.get_player_open_entries = function(player){
	    $http.get("[APIHOST]/player/"+$state.params.playerId+'/entry/active',{timeout:5000}).success(
		function(data){
                    player_active_entry = data;
		    //$scope.check_player_open_entries(player_open_entries,player);
		    if(!$scope.check_player_machine(player) || !$scope.check_player_open_entries(player_active_entry,player)){
			StatusModal.loaded();
			return;
		    }

		    for(entry_index in player_active_entry[$scope.division_id]){
			scores = player_active_entry[$scope.division_id][entry_index].scores;
		    }
		    console.log(scores);		    
		    if($scope.check_for_double_dipping(player,scores,$scope.machine_id)){
			StatusModal.loaded();
			return;
		    }		    
		    $scope.player = player;
		    $scope.get_machine();
		    
		});                                	    
	};
	$scope.get_player = function(){
	    StatusModal.loading()
            $http.get('[APIHOST]/player/'+$scope.player_id,{timeout:5000}).success(
                function(data) {                    
                    $scope.get_player_open_entries(data);
                }
            );
        };


	$scope.get_player();
	//2 options :
	//1) machine is already in use, so record score
	//2) machine is not in use, so report that player has been assigned to machine
	
    })
