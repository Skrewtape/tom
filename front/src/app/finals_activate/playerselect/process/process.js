angular.module('app.finals_activate.playerselect.process',[/*REPLACEMECHILD*/]);
angular.module('app.finals_activate.playerselect.process').controller(
    'app.finals_activate.playerselect.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	//$scope.player_info=$state.params.newPlayerInfo;
        $scope.num_qualifiers = $state.params.finalsNumberQualifiers;
        $scope.tournament_style = $state.params.finalsPlayerSelectionType;
        if($scope.tournament_style != "ppo"){
            $scope.description="none";
        }
        $scope.num_players_per_group = $state.params.finalsNumPlayersPerGroup;
        $scope.num_games_per_match = $state.params.finalsNumGamesPerMatch;
        $scope.number_checked = 0;
        $scope.checked_players = $state.params.checkedPlayers;
        $scope.division_id = $state.params.divisionId;
        $scope.num_qualifiers_a = parseInt($state.params.finalsNumberQualifiersA);
        $scope.num_qualifiers_b = parseInt($state.params.finalsNumberQualifiersB);

	if($scope.checkForBlankParams($state.params.checkedPlayers) == true){
	    return;
	}
        
	$scope.player_promise = TimeoutResources.GetAllPlayers(undefined);
        $scope.list_of_checked_players = "";
        // for(idx in $scope.checked_players){
        //     if($scope.checked_players[idx].checked == true){
        //         if(idx != 0){
        //             $scope.list_of_checked_players = $scope.list_of_checked_players+",";
        //         }
        //         $scope.list_of_checked_players = $scope.list_of_checked_players+$scope.checked_players[idx].player_id;                
        //     }
        // }
        
	StatusModal.loading();
        if($scope.tournament_style == "ppo"){
            $scope.description = "A";            
        }
	$scope.add_finals_promise = TimeoutResources.AddFinals($scope.player_promise,{division_id:$scope.division_id,num_players:$scope.num_qualifiers,num_players_per_group:$scope.num_players_per_group,num_games_per_match:$scope.num_games_per_match,description:$scope.description});
	$scope.add_finals_promise.then(function(data){
	    finals_ex_id=data.finals_ex_id;
	    $scope.gen_finals_promise = TimeoutResources.GenerateFinalsRounds($scope.add_finals_promise,{finals_id:finals_ex_id});
            if($scope.tournament_style == "ppo"){
                $scope.checked_players_b = $scope.checked_players.slice($scope.num_qualifiers_a,$scope.checked_players.length);
                $scope.checked_players = $scope.checked_players.slice(0,$scope.num_qualifiers_a);
            }            
	    $scope.fill_finals_promise = TimeoutResources.FillFinalsRounds($scope.gen_finals_promise,{finals_ex_id:finals_ex_id},{checked_players:$scope.checked_players});
	    $scope.get_finals_promise = TimeoutResources.GetFinals($scope.fill_finals_promise);		
	    $scope.get_finals_promise.then(function(data){
	     	$scope.resources = TimeoutResources.GetAllResources();
                if($scope.tournament_style != "ppo"){
                    StatusModal.loaded();
                }
	    });
	});
        if($scope.tournament_style == "ppo"){
            $scope.description = "B";            
        } else {            
            return;
        }
	$scope.add_finals_b_promise = TimeoutResources.AddFinals($scope.player_promise,{division_id:$scope.division_id,num_players:$scope.num_qualifiers,num_players_per_group:$scope.num_players_per_group,num_games_per_match:$scope.num_games_per_match,description:$scope.description});
        $scope.add_finals_b_promise.then(function(data){
	    finals_ex_id=data.finals_ex_id;
	    $scope.gen_finals_promise = TimeoutResources.GenerateFinalsRounds($scope.add_finals_promise,{finals_id:finals_ex_id});
	    $scope.fill_finals_promise = TimeoutResources.FillFinalsRounds($scope.gen_finals_promise,{finals_ex_id:finals_ex_id},{checked_players:$scope.checked_players_b});
	    $scope.get_finals_promise = TimeoutResources.GetFinals($scope.fill_finals_promise);		
	    $scope.get_finals_promise.then(function(data){
	     	$scope.resources = TimeoutResources.GetAllResources();
		StatusModal.loaded();
	    });
	});


    }
);
