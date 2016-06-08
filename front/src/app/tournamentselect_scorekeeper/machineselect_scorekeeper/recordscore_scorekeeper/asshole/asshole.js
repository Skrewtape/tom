angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole',
    function($scope, $state, StatusModal, TimeoutResources) {
        $scope.player_id=$state.params.playerId;
        $scope.team_id=$state.params.teamId;
        $scope.team_tournament=$state.params.teamTournament;        
        StatusModal.loading();
                if($scope.team_tournament == "false"){
	    $scope.asshole_promise = TimeoutResources.GetPlayer(undefined,{player_id:$scope.player_id},{/*post_data*/});
        }
        if($scope.team_tournament == "true"){
	    $scope.asshole_promise = TimeoutResources.GetTeam(undefined,{team_id:$scope.team_id},{/*post_data*/});
        }        
        $scope.asshole_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
    }
);
