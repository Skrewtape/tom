angular.module('app.finalselect_finals.matchselect_finals.matchscores_finals',[/*REPLACEMECHILD*/]);
angular.module('app.finalselect_finals.matchselect_finals.matchscores_finals').controller(
    'app.finalselect_finals.matchselect_finals.matchscores_finals',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.match = {score:undefined}
        $scope.finals_id=$state.params.finalsId;
	$scope.match_machine = {}
	$scope.match_id=$state.params.matchId;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player = TimeoutResources.addPlayerResource().addPlayer(submit_data);
	StatusModal.loading()
	//TimeoutResources.GetActiveMachinesArray();
        //TimeoutResources.GetActiveMachines();
	$scope.active_machines = TimeoutResources.GetActiveMachines();
	//$scope.finals_match_promise = TimeoutResources.GetFinalsMatch($scope.active_machines,{match_id:$scope.match_id});
	$scope.finals_matches_promise = TimeoutResources.GetFinalsMatches($scope.active_machines,{finals_id:$scope.finals_id});
        
	$scope.finals_matches_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources()
	    StatusModal.loaded()	    
	})

	$scope.save_machine = function(match,game_num,division_machine_id){
	    StatusModal.loading()
	    $scope.promise = TimeoutResources.SetMatchMachine(undefined,{divisionMachineId:division_machine_id,finalsMatchId:match.match_id,gameNumber:game_num});	    
	    $scope.promise.then(function(data){
		StatusModal.loaded();
	    })
	}
	
	$scope.save_score = function(score,games){
	    score.score = score.new_score;
	    StatusModal.loading()
	    score.score = score.score.replace(/,/g,"");
            score.score = parseInt(score.score)
	    $scope.promise = TimeoutResources.SetMatchScore(undefined,{finalsScoreId:score.finals_player_score_id,score:score.score});	    
	    $scope.promise.then(function(data){
		StatusModal.loaded();		
	    })	    
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
