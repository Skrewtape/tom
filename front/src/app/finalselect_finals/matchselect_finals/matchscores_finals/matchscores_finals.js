angular.module('app.finalselect_finals.matchselect_finals.matchscores_finals',[/*REPLACEMECHILD*/]);
angular.module('app.finalselect_finals.matchselect_finals.matchscores_finals').controller(
    'app.finalselect_finals.matchselect_finals.matchscores_finals',
    function($scope, $state, StatusModal, TimeoutResources, $anchorScroll, $location) {
	$scope.match = {score:undefined}
        $scope.finals_ex_id=$state.params.finalsExId;
	$scope.match_machine = {}
	$scope.finals_match_ex_id=$state.params.finalsMatchExId;
        $scope.round = $state.params.round;
	StatusModal.loading();        
        $scope.machines_promise = TimeoutResources.GetAllMachines();
        $scope.finals_promise = TimeoutResources.GetFinals($scope.machines_promise,{finals_ex_id:$scope.finals_ex_id});
        
	$scope.finals_match_promise = TimeoutResources.GetFinalsMatch($scope.finals_promise,{finals_match_ex_id:$scope.finals_match_ex_id});
	//$scope.finals_matches_promise = TimeoutResources.GetFinalsMatches($scope.machines_promise,{finals_id:$scope.finals_id});
        
	$scope.onScoreChange = function(score){
            score.dirty=true;
            score.score = score.score.replace(/\,/g,'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	};

        
	$scope.finals_match_promise.then(function(data){            
            $scope.resources = TimeoutResources.GetAllResources()            
            for(result_idx in $scope.resources.finals_match.results){
                result = $scope.resources.finals_match.results[result_idx];
                $scope.set_result_finished(result);
                for (score_idx in result.scores){
                    if (result.scores[score_idx].score != null){
                        result.scores[score_idx].score = String(result.scores[score_idx].score).replace(/\,/g,'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                    }
                }
                
                
            }
            
	    StatusModal.loaded()	    
	})

        $scope.match_finished = function(){
            return $scope.resources.finals_match.match_state=="Finished";
        }
        $scope.set_result_finished = function(result){
            for(score_idx in result.scores){
                score = result.scores[score_idx];
                if(score.score == null){
                    result.state = undefined
                    return false;
                }
            }
            result.state = "finished"
            return true;            
        }


	// $scope.save_machine = function(match,game_num,division_machine_id){
        $scope.save_machine = function(finals_match_result_ex){            
	    StatusModal.loading()
            finals_match_result_ex.result_state="In Progress";
            finals_match_result_ex.finals_machine_id=finals_match_result_ex.finals_machine.machine_id;
            $scope.finals_match_promise = TimeoutResources.SetFinalsMatchInProgress(undefined,{finals_match_ex_id:$scope.finals_match_ex_id});            
            $scope.finals_match_result_promise = TimeoutResources.SetFinalsMatchResultMachine($scope.finals_match_promise,
                                                                                              {finals_match_result_ex_id:finals_match_result_ex.finals_match_result_ex_id,
                                                                                               machine_id:finals_match_result_ex.finals_machine.machine_id});
	    $scope.finals_match_result_promise.then(function(data){
                finals_match_result_ex.dirty=undefined;
		StatusModal.loaded();
	    })
	}

        $scope.calculate_player_total_points_in_match=function(finals_match,finals_player_ex_id){
            total_score = 0;
            for(result_idx in finals_match.results){
                result = finals_match.results[result_idx];
                for(score_idx in result.scores){
                    score = result.scores[score_idx];
                    if(score.finals_player_ex_id == finals_player_ex_id){
                        total_score = total_score + score.rank;
                    }
                }
            }
            return total_score;
        }

        $scope.save_tiebreaker = function(){
            for(slot_idx in $scope.resources.finals_match.slots){
                slot = $scope.resources.finals_match.slots[slot_idx];
                slot.tie_breaker=false;
            }
            StatusModal.loading();            
            $scope.finals_match_slots_promise = TimeoutResources.SetFinalsMatchSlots(undefined,{},$scope.resources.finals_match.slots);
            $scope.finals_match_get_slots_promise = TimeoutResources.GetFinalsMatchSlots($scope.finals_match_slots_promise,
                                                                                         {finals_match_ex_id:$scope.resources.finals_match.finals_match_ex_id});
            //$scope.resources.finals_match.match_state="Finished";
            //$scope.finals_match_promise = TimeoutResources.SetFinalsMatch($scope.finals_match_get_slots_promise,
            //                                                              {finals_match_ex_id:$scope.resources.finals_match.finals_match_ex_id},
            //                                                              $scope.resources.finals_match);
            $scope.tie_breaker_resolve_promise = TimeoutResources.ResolveTieBreaker($scope.finals_match_get_slots_promise,
                                                                                    {finals_match_ex_id:$scope.resources.finals_match.finals_match_ex_id})
            $scope.finals_match_promise.then(function(data){
                console.log(TimeoutResources.GetAllResources());
                $scope.resources.finals_match.slots = $scope.resources.finals_match_slots.slots;

                StatusModal.loaded();                
             });           
        };
        
        $scope.match_has_tiebreakers = function(){            
            if($scope.resources == undefined){
                return false;
            }
            for(slot_idx in $scope.resources.finals_match.slots){
                slot = $scope.resources.finals_match.slots[slot_idx];
                if (slot.tie_breaker==true){
                    console.log('checking if match has tiebreakers - found one');
                    return true;
                }
            }
            return false;
        }
	$scope.save_result_finished = function(finals_match_result_ex){
            StatusModal.loading();
            finals_match_result_ex.result_state="finished";
            $scope.finals_match_result_promise = TimeoutResources.SetFinalsMatchResult(undefined,{finals_match_result_ex_id:finals_match_result_ex.finals_match_result_ex_id},finals_match_result_ex);
            $scope.finals_match_slots_promise = TimeoutResources.GetFinalsMatchSlots($scope.finals_match_result_promise,{finals_match_ex_id:$scope.resources.finals_match.finals_match_ex_id});
            $scope.finals_match_slots_promise.then(function(data){                                                
                for(result_idx in $scope.resources.finals_match.results){
                    result = $scope.resources.finals_match.results[result_idx];
                    if (result = finals_match_result_ex){
                        finals_match_result_ex.scores = TimeoutResources.GetAllResources().changed_match_result.scores;                                        
                        //finals_match_result_ex.scores = $scope.resources.changed_match_result.scores;                                        

                    }
                }
                $scope.resources.finals_match.slots = $scope.resources.finals_match_slots.slots;
                //finals_match_result_ex = $scope.resources.changed_match_result;                
                //$scope.set_result_finished(finals_match_result_ex);
                // - Scroll to top of containedElement with a margin of 10px;
                StatusModal.loaded();
                
                
	    });
	};

        
	$scope.save_result_score = function(finals_match_result_ex, score){
	    StatusModal.loading();            
            $scope.finals_match_result_promise = TimeoutResources.SetFinalsMatchResult(undefined,{finals_match_result_ex_id:finals_match_result_ex.finals_match_result_ex_id},finals_match_result_ex);
            $scope.finals_match_result_promise.then(function(data){                
                score.dirty=undefined;
                finals_match_result_ex.result_state = $scope.resources.changed_match_result.result_state;
                StatusModal.loaded();
                
                
	    });
	};

        $scope.mark_taken_player_as_disabled = function(scores, finals_player_ex_id, cur_score){                        
            for (score_idx in scores){
                score = scores[score_idx];                
                if(score.finals_player_ex_id == finals_player_ex_id && score.order == cur_score.order){
                    return false;
                }

                if(score.finals_player_ex_id == finals_player_ex_id){
                    return true;
                }
            }
            return false;
        }
	
	$scope.format_number = function(score){
	    match_score = score.new_score.replace(/,/g,"")

	    if(match_score.length<4){
		return
	    }
	    
	    score_chunks = score.new_score.split(",")
	    if(score_chunks.length==0){
		return
	    }
	    
	    score.new_score="";	    
	    for(x=0;x<score_chunks.length;x++){
	    	if(score_chunks[x].length>=3){
	    	    score.new_score = score.new_score+score_chunks[x].substring(0,1)+","+score_chunks[x].substring(1)
		}
	    	if(score_chunks[x].length<3){
	    	    score.new_score = score.new_score+score_chunks[x]
	    	}
	    }	    
	}
    }
);
