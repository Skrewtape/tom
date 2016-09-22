angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process.undo',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.playerselect_scorekeeper.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.player_id=$state.params.playerId;
        $scope.process_submit=$state.params.process_submit;
	$scope.team=$state.params.team;
        $scope.undo_button_class = "lightred";
        
	//$scope.division_id = $state.params.divisionId;
	$scope.division_machine_id = $state.params.divisionMachineId;        
	$scope.team_tournament = $state.params.teamTournament;
	//if($scope.checkForBlankParams($scope.player_id) == true){
	//    return;
        //	}

	if($scope.checkForBlankParams($scope.process_submit) == true){
	   return;
        }
	
	StatusModal.loading();
	$scope.player_promise = TimeoutResources.GetPlayer($scope.tournament_promise,{player_id:$scope.player_id});        
	if($scope.team_tournament == "false"){
	    $scope.set_division_machine_promise = TimeoutResources.SetDivisionMachinePlayer($scope.player_promise,{player_id:$scope.player_id,division_machine_id:$scope.division_machine_id});
	}
	if($scope.team_tournament == "true"){
	    $scope.set_division_machine_promise = TimeoutResources.SetDivisionMachineTeam($scope.player_promise,{team_id:$scope.team.team_id,division_machine_id:$scope.division_machine_id});
	}
	$scope.set_division_machine_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();	    
	    StatusModal.loaded();
	});
        $scope.two_step_undo = function(){
            if($scope.undo_button_class == "red"){                
                $state.go(".undo",{undoPlayerId:$scope.resources.player.player_id});
            }            
            if($scope.undo_button_class == "lightred"){
                $scope.undo_button_class="red";
            }
        }

    }
);
