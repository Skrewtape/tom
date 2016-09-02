angular.module('app.finalselect_finals.matchselect_finals',['app.finalselect_finals.matchselect_finals.matchscores_finals',/*REPLACEMECHILD*/]);
angular.module('app.finalselect_finals.matchselect_finals').controller(
    'app.finalselect_finals.matchselect_finals',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.finals_ex_id=$state.params.finalsExId;
	$scope.state = $state;
        $scope.tab_to_activate = $state.params.tab_to_activate;        
        if($scope.tab_to_activate < 1){
            $scope.tab_to_activate=1;
        }
        console.log($scope.tab_to_activate);
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	StatusModal.loading()
	$scope.finals_matches_promise = TimeoutResources.GetFinalsMatches(undefined,{finals_ex_id:$scope.finals_ex_id});
	$scope.finals_matches_promise.then(function(data){
            rounds = new Array(data.rounds);
            for(x=0;x<rounds.length;x++){
                rounds[x]=[];
            }
	    $scope.resources = TimeoutResources.GetAllResources()                        
            for (match_idx in $scope.resources.finals_matches.matches){
                match = $scope.resources.finals_matches.matches[match_idx]                
                rounds[match.round_number-1].push($scope.resources.finals_matches.matches[match_idx]);                
            }
            $scope.resources.finals_matches.rounds=rounds;
            
            StatusModal.loaded();
	})

        $scope.complete_finals_round = function(round_number){
            StatusModal.loading();
	    $scope.promise_complete = TimeoutResources.CompleteFinalsRound(undefined,{finals_ex_id:$scope.finals_ex_id,round_number:round_number});
	    $scope.promise_get = TimeoutResources.GetFinalsMatches($scope.promise_complete,{finals_ex_id:$scope.finals_ex_id});
            $scope.promise_get.then(function(data){
                StatusModal.loaded()
                $scope.resources = TimeoutResources.GetAllResources();
                rounds = new Array(data.rounds);
                for(x=0;x<rounds.length;x++){
                    rounds[x]=[];
                }
	        $scope.resources = TimeoutResources.GetAllResources()                        
                for (match_idx in $scope.resources.finals_matches.matches){
                    match = $scope.resources.finals_matches.matches[match_idx]                
                    rounds[match.round_number-1].push($scope.resources.finals_matches.matches[match_idx]);                
                }
                $scope.resources.finals_matches.rounds=rounds;
                
            })
        }
        $scope.is_round_ready_to_be_finished = function(round){

            for (match_idx in round){
                match = round[match_idx];
                console.log(match);
                if(match.match_state!="Finished" && match.match_state!=undefined){                    
                    console.log(match.match_state);
                    return false;
                }
                for(slot_idx in match.slots){
                    slot = match.slots[slot_idx];
                    if(slot.final_rank != undefined && slot.result != "Advance"){
                        return false
                    }
                }
            }
            
            return true;
        }

        
	$scope.add_player_to_match = function(finals_match){
	    console.log('okay');
	}
	
	$scope.are_all_players_set_in_match = function(finals_match){
	    for(finals_player_key in finals_match.finals_players){
		if (finals_match.finals_players[finals_player_key].player_id == null){
		    return false;
		}
	    }
	    return true;
	}
	    
	$scope.open_match = function(finals_match_ex){
            round = $scope.resources.finals_matches.rounds[finals_match_ex.round_number-1];
            
            for (match_idx in round){
                match = round[match_idx];
                for(slot_idx in match.slots){
                    slot = match.slots[slot_idx];
                    if(slot.final_rank != undefined && slot.result != "Advance"){
                        return false
                    }
                }
            }

	    $state.go(".matchscores_finals",{finalsMatchExId:finals_match_ex.finals_match_ex_id,round:finals_match_ex.round_number})
	    //$state.go(".matchscores_finals",{matchId:finals_match.match_id})
	}
    }
);
