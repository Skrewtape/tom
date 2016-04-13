app.controller(
    'results_home_players_results',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
	Page.set_title('Player Info');
	$scope.http_reqs = 7;
        $scope.player_id=$state.params.playerId;
	$scope.available_entries = {};
	$scope.inprogress_entries = {};
	$scope.inprogress_estimates = {};
	$scope.inprogress_entry_estimates = {};
	$scope.dynamic = 0;
	
	$scope.check_for_loaded = function(){
	    $scope.http_reqs=$scope.http_reqs-1;	  
	    $scope.dynamic=$scope.dynamic+1;
	    console.log($scope.http_reqs);
	    if($scope.http_reqs<=0){
		//StatusModal.loaded();
		$scope.page_loaded=true;
	    }
	}

	$scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament',{timeout:5000}).success(
                function(data) {                    
                    $scope.tournaments = data;
		    $scope.check_for_loaded($scope.http_reqs);
                }
            );
        };

	$scope.reset_timer = function(timer){
	    console.timeEnd(timer);
	    console.time(timer);
	}

	$scope.all_done = function(timer){
	    console.timeEnd(timer);
	}

        $scope.get_divisions = function(){
            $http.get('[APIHOST]/division',{timeout:5000}).success(
                function(data) {                    
                    $scope.divisions = data;
		    $scope.check_for_loaded($scope.http_reqs);
		    //$scope.get_tournaments();
                }
            );
        };

	$scope.get_score_estimate = function(entry){
            $http.get("[APIHOST]/entry/"+entry.entry_id+"/estimate_score_ranks",{timeout:5000}).success(
               function(data){
		   console.log('getting score estimate');
		   console.log(data);
		   entry_score_estimate = 0;
		   $scope.inprogress_estimates=data;
		   for(score_id in data){
		       entry_score_estimate = entry_score_estimate + data[score_id].estimated_points;
		   }
		   $scope.inprogress_entry_estimates[data[score_id].entry_id]=entry_score_estimate;
	       })
	}
	
	$scope.get_unstarted_entry = function(){
            $http.get("[APIHOST]/player/"+$state.params.playerId+"/entry/unstarted",{timeout:5000}).success(
                function(data){
		    $scope.check_for_loaded($scope.http_reqs);
		    $scope.unstarted_entries = data;
		    //$scope.get_divisions();
		})
	}

	$scope.get_active_entry = function(){
            $http.get("[APIHOST]/player/"+$state.params.playerId+"/entry/active",{timeout:5000}).success(
                function(data){
		    $scope.check_for_loaded($scope.http_reqs);
		    $scope.active_entries = data;
		    //$scope.get_unstarted_entry();
		})
	}

        $scope.get_entries = function(){
            $http.get("[APIHOST]/player/"+$state.params.playerId+"/entry/all",{timeout:5000}).success(
                function(data){
		    $scope.check_for_loaded($scope.http_reqs);
		    $scope.entries = data;
		    //$scope.get_active_entry();
		})
	}
	
        // $scope.get_entries_old = function(){
        //     $http.get("[APIHOST]/player/"+$state.params.playerId+"/entry/all",{timeout:5000}).success(
        //         function(data){
	// 	    for(div_index in data){
	// 		div_entries = data[div_index];
	// 		$scope.available_entries[div_index]=undefined;
	// 		$scope.inprogress_entries[div_index]=undefined;
	// 		for(entry_id in div_entries){
	// 		    entry = div_entries[entry_id];
	// 		    if(entry.voided==false && entry.completed==false && entry.active==false){
	// 			if($scope.available_entries[div_index]==undefined){
	// 			    $scope.available_entries[div_index]=[];
	// 			}
	// 			$scope.available_entries[div_index].push(entry);
	//  		    }
	// 		    if(entry.voided==false && entry.completed==false && entry.active==true){
	// 			if($scope.inprogress_entries[div_index]==undefined){
	// 			    $scope.inprogress_entries[div_index]=[];
	// 			}
	// 			$scope.inprogress_entries[div_index].push(entry);
	//  		    }			    
	// 		}
	// 	    }
        //             $scope.entries = data;
	// 	    console.log(data);
        //             $scope.get_divisions();
        //         }
        //     );
        // };

	$scope.calc_machine_score_points = function(rank){
	    if(rank >= 100 || rank == undefined){
		return 0;
	    }
	    return 100-rank;
	}

        $scope.get_machines = function(){
            $http.get('[APIHOST]/machine',{timeout:5000}).success(
                function(data) {                    
		    $scope.machines = data;
		    $scope.check_for_loaded($scope.http_reqs);
		    //$scope.get_entries();
                }
            );
        };

        $scope.get_player = function(){
            $http.get('[APIHOST]/player/'+$scope.player_id,{timeout:5000}).success(
                function(data) {                    
		    $scope.player = data;
		    $scope.check_for_loaded($scope.http_reqs);
		    //$scope.get_machines();
                }
            );
        };

	//StatusModal.loading();
	$scope.get_tournaments();
	$scope.get_divisions();	
	$scope.get_unstarted_entry();
	$scope.get_active_entry();
	$scope.get_entries();
	$scope.get_machines();
	$scope.get_player();
                
    });
