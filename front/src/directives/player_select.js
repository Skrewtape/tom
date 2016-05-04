//FIXME : handle multiple tournaments with multiple divisions
angular.module('tom_directives.player_select', []);
angular.module('tom_directives.player_select').controller(
    'player_select',function($scope, $state, StatusModal, TimeoutResources, $filter){
        // $http.get('[APIHOST]/player',{timeout:5000}).success(
        //     function(data) {
        //         $scope.players = data.players;
	// 	StatusModal.loaded();
        //     }
        // );
	$scope.popovertemplate='myPopoverTemplate.html';
	$scope.submitPlayerDisabled=true;
	StatusModal.loading();
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
		return;
	    } 
	    if($scope.selected_players.length>0){
		console.log($scope.player.player_id);
                first_name = $scope.selected_players[0].first_name;
                last_name = $scope.selected_players[0].last_name;
                $scope.keypad_player_name = first_name +' '+last_name;
                $scope.popoverIsOpen = true;
                $scope.select_player = $scope.selected_players[0];
		$scope.submitPlayerDisabled=false;
		if($scope.selected_players[0].player_is_an_asshole_count > 2){
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
