app.controller(
    'entryedit',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal, $filter) {
        Page.set_title('Edit Players');
        $scope.selected_division_in_tournament={};
        $scope.player_id =$state.params.playerId;
        $scope.score_machine = {};
        $scope.score_modified = {};

	$scope.set_score_machine_dict = function(entries){
            for( tourney_index in entries){
                tourney_entries = entries[tourney_index];
                for ( entry_index in tourney_entries){
                    entry = tourney_entries[entry_index];
                    for (score_index in entry.scores){
                        score = entry.scores[score_index];
                        $scope.score_machine[score.score_id] = $scope.machines[score.machine_id];
                        $scope.score_modified[score.score_id] = 'clean';
                    }
                }                
            }
        };

	
        $scope.get_entries = function(){
            $http.get("[APIHOST]/player/"+$state.params.playerId+"/entry/all",{timeout:5000}).success(
                function(data){
                    $scope.entries = data;
                    $scope.set_score_machine_dict($scope.entries);
		    StatusModal.loaded();
                }
            );
        };
	
	$scope.get_machines = function(){
            $http.get("[APIHOST]/machine",{timeout:5000}).success(
                function(data){
                    $scope.machines = data;
		    StatusModal.addDebugMsg('get entries');		    		    
                    $scope.machines_array = [];
                    for(machine_index in $scope.machines){
                        machine = $scope.machines[machine_index];
                        $scope.machines_array.push(machine);
                    }
                    $scope.get_entries();
                }
            );
        };                

	
	$scope.get_player = function(){
            $http.get("[APIHOST]/player/"+$state.params.playerId,{timeout:5000}).success(
                function(data){
                    $scope.player = data;
		    StatusModal.addDebugMsg('get machines');		    		    
                    $scope.get_machines();
                }
            );
        };

	
	$scope.get_divisions = function(){
            $http.get('[APIHOST]/division',{timeout:5000}).success(
                function(data) {                    
                    $scope.divisions = data;                    
		    StatusModal.addDebugMsg('get player');		    
                    $scope.get_player();
                }
            );
        };

        
        $scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament',{timeout:5000}).success(
                function(data) {                    
                    $scope.tournaments = data;
		    StatusModal.addDebugMsg('get divisons');		    
                    $scope.get_divisions();
                }
            );
        };

        StatusModal.loading('playerlist.entryedit.js - get tournaments');
        $scope.get_tournaments();

	$scope.score_and_machine_change = function(score){
            console.log('change!' + score);
            $scope.score_modified[score.score_id] = 'dirty';
        };

	
        $scope.change_score = function(score){
            StatusModal.loading('playerlist.entryedit.js - change score');
            console.log($scope.score_machine[score.score_id]);
            $http.put('[APIHOST]/score/'+score.score_id,{machine_id: $scope.score_machine[score.score_id].machine_id,score: score.score},{timeout:5000}).success(
                function(data) {                    
                    StatusModal.loaded();
                    $scope.score_modified[score.score_id]='updated';
                }
            );                            
        };
	
	
        $scope.remove_local_score = function(score){
            for( tourney_index in $scope.entries){
                tourney_entries = $scope.entries[tourney_index];
                for ( entry_index in tourney_entries){
                    entry = tourney_entries[entry_index];
                    entry.scores.splice(entry.scores.indexOf(score),1);
                }                
            }
        };
        
        $scope.remove_score = function(score){
            StatusModal.loading('playerlist.entryedit.js - remove score');                
            $http.delete('[APIHOST]/score/'+score.score_id).success(
                function(data) {                    
                    StatusModal.loaded();
                    $scope.score_modified[score.score_id]='updated';                                
                    $scope.remove_local_score(score);
                }
            );                                        
        };
	$scope.setEntryVoidStatus = function(entry){
            StatusModal.loading('playerlist.entryedit.js - set entry void status');                
            $http.put('[APIHOST]/entry/'+entry.entry_id,entry,{},{timeout:5000}).success(
                function(data) {                    
                    StatusModal.loaded();
                }
            );                            
        };                      


        
    });
