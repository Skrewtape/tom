angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.confirm','app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.void','app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper',
    function($scope, $state, StatusModal, TimeoutResources, $filter, $document) {
	$scope.division_machine_id = $state.params.divisionMachineId;
	$scope.division_id=$state.params.divisionId;
	$scope.player_id = $state.params.playerId;
	$scope.team_id = $state.params.teamId;	
	$scope.formatted_score = {};
	$scope.disabledScoreKeeping = true;
	$scope.team_tournament = $state.params.teamTournament;
        $scope.tournament_type = $state.params.tournamentType;
	$scope.fuckIos = function(){
	    var input = window.document.querySelector("#realscoreinput");
	    input.focus();
	};

        
	$scope.onScoreChange = function(){
	    // $scope.formatted_score.score = $filter('number')($scope.new_score);
	    // if($scope.new_score > 0){
	    //     $scope.disabledScoreKeeping = false;
	    // } else {
	    //     $scope.disabledScoreKeeping = true;
	    // }
            $scope.new_score = $scope.new_score.replace(/\,/g,'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	};
	
	//SIGH : loading modal causes problem with input field focus
	//StatusModal.loading();
        if($scope.tournament_type == "herb"){
            $scope.herb_best_scores_promise = TimeoutResources.GetHerbBestScores(undefined,{division_id:$scope.division_id,player_id:$scope.player_id});
	    $scope.machines_promise = TimeoutResources.GetActiveMachines($scope.herb_best_scores_promise);            
        } else{
	    $scope.machines_promise = TimeoutResources.GetActiveMachines();
        }
	$scope.division_machine_promise = TimeoutResources.GetDivisionMachine($scope.machines_promise,{division_machine_id:$scope.division_machine_id});        
	if($scope.team_tournament == "false"){
	    $scope.player_promise = TimeoutResources.GetPlayer($scope.division_machine_promise,{player_id:$scope.player_id});	    
	    $scope.entry_promise = TimeoutResources.GetPlayerActiveEntry($scope.player_promise,
									 {player_id:$scope.player_id,
									  division_id:$scope.division_id});
	} else {
	    $scope.team_promise = TimeoutResources.GetTeam($scope.division_machine_promise,{team_id:$scope.team_id});	    
	    $scope.entry_promise = TimeoutResources.GetTeamActiveEntry($scope.team_promise,
								       {team_id:$scope.team_id,
									division_id:$scope.division_id});
	}
	
	$scope.entry_promise.then(function(data){
	    //StatusModal.loaded()
            
	    $scope.resources = TimeoutResources.GetAllResources();
	    console.log($scope.resources);
	    //FIXME : shouldn't have seperate resources.player_active_entry and resources.team_active_entry
	    // if($scope.team_tournament == "false"){
	    //     $scope.active_entry = $scope.resources.active_entry
	    // } else {
	    //     $scope.active_entry = $scope.resources.active_entry
	    // }
	});
    }
);
