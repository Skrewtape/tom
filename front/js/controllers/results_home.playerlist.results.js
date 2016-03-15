app.controller(
    'results_home_players_results',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        $scope.player_id=$state.params.playerId;
	$scope.available_entries = {};
	$scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament',{timeout:5000}).success(
                function(data) {                    
                    $scope.tournaments = data;
		    StatusModal.loaded();
                }
            );
        };

	
        $scope.get_divisions = function(){
            $http.get('[APIHOST]/division',{timeout:5000}).success(
                function(data) {                    
                    $scope.divisions = data;
		    $scope.get_tournaments();
                }
            );
        };

        $scope.get_entries = function(){
            $http.get("[APIHOST]/player/"+$state.params.playerId+"/entry/all",{timeout:5000}).success(
                function(data){
		    for(div_index in data){
			div_entries = data[div_index];
			$scope.available_entries[div_index]=undefined;
			for(entry_id in div_entries){
			    entry = div_entries[entry_id];
			    
			    if(entry.voided==false && entry.completed==false && entry.active==false){
				if($scope.available_entries[div_index]==undefined){
				    $scope.available_entries[div_index]=[];
				}
				$scope.available_entries[div_index].push(entry);
	 		    }
			}
		    }
                    $scope.entries = data;
		    console.log(data);
                    $scope.get_divisions();
                }
            );
        };

        $scope.get_machines = function(){
            $http.get('[APIHOST]/machine',{timeout:5000}).success(
                function(data) {                    
		    $scope.machines = data;
		    $scope.get_entries();
                }
            );
        };

	
        $scope.get_player = function(){
            $http.get('[APIHOST]/player/'+$scope.player_id,{timeout:5000}).success(
                function(data) {                    
		    $scope.player = data;
		    $scope.get_machines();
                }
            );
        };

	StatusModal.loading();
        $scope.get_player();
                
    });
