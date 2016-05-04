angular.module('app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add.process',[/*REPLACEMECHILD*/]);
angular.module('app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add.process').controller(
    'app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add.process',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.team_name=$state.params.teamName;
	$scope.player_one_id=$state.params.playerOneId;
	$scope.player_two_id=$state.params.playerTwoId;
	StatusModal.loading();
	$scope.player_one_promise = TimeoutResources.GetPlayer(undefined,{player_id:$scope.player_one_id});
	$scope.player_two_promise = TimeoutResources.GetPlayer($scope.player_one_promise,{player_id:$scope.player_two_id});
	$scope.team_add_promise = TimeoutResources.AddTeam($scope.player_two_promise,undefined,{team_name:$scope.team_name,players:[$scope.player_one_id,$scope.player_two_id]})
	$scope.team_add_promise.then(function(data){
	    StatusModal.loaded()
	    $scope.resources = TimeoutResources.GetAllResources();
	})
    }
);
