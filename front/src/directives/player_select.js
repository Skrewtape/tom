//FIXME : handle multiple tournaments with multiple divisions
angular.module('tom_directives.player_select', []);
angular.module('tom_directives.player_select').controller(
    'player_select',function($scope, $state, StatusModal, TimeoutResources, $filter){
	$scope.popovertemplate='myPopoverTemplate.html';
	$scope.submitPlayerDisabled=true;
	$scope.team_tournament=$state.params.teamTournament;
	StatusModal.loading();
	//TimeoutResources.FlushResourceCache("player");
	//TimeoutResources.FlushResourceCache("players");	
	$scope.all_players_promise = TimeoutResources.GetAllPlayers();
	$scope.all_players_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();
	    $scope.resources.players = $scope.resources.players.players;
	    StatusModal.loaded();
	})
	$scope.player = {player_id:''};
	$scope.fuckIos = function(){
	    var input = document.querySelector("#poop");
	    input.focus();
	}
	$scope.onChange = function(){
	    $scope.player_is_asshole=false;	    
            $scope.selected_players = $filter('filter')($scope.resources.players,$scope.player.player_id,true)
	    //$scope.selected_players = $filter('orderBy')($scope.selected_players_list,'player_id');
	    if($scope.player.player_id == null || $scope.selected_players.length==0){
                $scope.keypad_player_name = 'does not exist';                
                $scope.popoverIsOpen = true;
                $scope.select_player = undefined;
		$scope.submitPlayerDisabled=true;
		$scope.keypad_player_team = undefined;                
		return;
	    } 
	    if($scope.selected_players.length>0){
                selected_player_index = 0;
                for(x=0;x<$scope.selected_players.length;x++){
                    if ($scope.selected_players[x].player_id == $scope.player.player_id){
                        selected_player_index=x;
                    }
                }
                first_name = $scope.selected_players[selected_player_index].first_name;
                last_name = $scope.selected_players[selected_player_index].last_name;
                team_name = undefined;
		if($scope.selected_players[selected_player_index].team != undefined && ($scope.team_tournament=="true" || $scope.team_tournament == undefined) ){
		    team_name = $scope.selected_players[selected_player_index].team.team_name;
		}
                $scope.keypad_player_name = first_name +' '+last_name;
                $scope.keypad_player_team = team_name;
                $scope.popoverIsOpen = true;
                $scope.select_player = $scope.selected_players[selected_player_index];
		$scope.submitPlayerDisabled=false;
		if($scope.selected_players[selected_player_index].player_is_an_asshole_count > 0){
		    $scope.player_is_asshole="(Player is Jagoff)";
		}
            } 
	}
	
	
    }).directive('playerSelect', function() {
	return {
	    transclude: true,
	    templateUrl: 'directives/player_select.html'
	};
    });
