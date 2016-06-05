angular.module('app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add',['app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add.process',/*REPLACEMECHILD*/]);
angular.module('app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add').controller(
    'app.teamname_team_add.playeroneselect_team_add.playertwoselect_team_add.review_team_add',
    function($scope, $state, StatusModal, TimeoutResources) {
	$scope.team_name=$state.params.teamName;
	$scope.player_one_id=$state.params.playerOneId;
	$scope.player_two_id=$state.params.playerTwoId;
	$scope.messages = "";
	StatusModal.loading();
	$scope.player_one_promise = TimeoutResources.GetPlayer(undefined,{player_id:$scope.player_one_id})	
	$scope.player_one_promise.then(function(data){
	    $scope.player_one = TimeoutResources.GetAllResources().player;
	})
	$scope.player_two_promise = TimeoutResources.GetPlayer($scope.player_one_promise,{player_id:$scope.player_two_id})		
	$scope.player_two_promise.then(function(data){
	    $scope.player_two = TimeoutResources.GetAllResources().player;            
	    if($scope.team_name == ''){
		$scope.team_name = $scope.player_one.first_name+' and '+$scope.player_two.first_name;
	    }
	    StatusModal.loaded();
	})
    }
);
