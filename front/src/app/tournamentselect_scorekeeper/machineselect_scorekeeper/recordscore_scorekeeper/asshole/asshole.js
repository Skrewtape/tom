angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole',['app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole.process',/*REPLACEMECHILD*/]);
angular.module('app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole').controller(
    'app.tournamentselect_scorekeeper.machineselect_scorekeeper.recordscore_scorekeeper.asshole',
    function($scope, $state, StatusModal, TimeoutResources) {
        $scope.player_id=$state.params.playerId;
        //if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
        StatusModal.loading();
	$scope.player_promise = TimeoutResources.GetPlayer(undefined,{player_id:$scope.player_id},{/*post_data*/});
        $scope.player_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
    }
);
