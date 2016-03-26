app.controller(
    'genericplayerselect',
    function($scope, $http, $timeout, $state, $location, $filter, Page) {        
        $scope.page_title =$state.params.pageTitle;
	$scope.change_nav_title('Player');
	$scope.focusInput={};
	$scope.focusInput.status=false;
        Page.set_title($scope.page_title);                
	$scope.popovertemplate='myPopoverTemplate.html';
	$scope.popoverIsOpen = false;
	$scope.submitPlayerDisabled=true;
	//possible errors : 500
	console.log('here comes the goods');
        $http.get('[APIHOST]/player',{timeout:5000}).success(
            function(data) {
                $scope.players = data.players;                
            }
        );
        $scope.player = {player_id:''};
	$scope.fuckIos = function(){
	    var input = document.querySelector("#poop");
	    console.log(input);
	    input.focus();
	    console.log('guck');
	}
	$scope.onChange = function(){
            $scope.selected_players = $filter('filter')($scope.players,$scope.player.player_id,true)
	    //$scope.selected_players = $filter('orderBy')($scope.selected_players_list,'player_id');
	    if($scope.player.player_id == "" || $scope.selected_players.length==0){
                $scope.keypad_player_name = 'does not exist';                
                $scope.popoverIsOpen = true;
                $scope.select_player = undefined;
		$scope.submitPlayerDisabled=true;
		return;
	    } 
	    if($scope.selected_players.length>0){
                first_name = $scope.selected_players[0].first_name;
                last_name = $scope.selected_players[0].last_name;
                $scope.keypad_player_name = first_name +' '+last_name;
                $scope.popoverIsOpen = true;
                $scope.select_player = $scope.selected_players[0];
		$scope.submitPlayerDisabled=false;
            } 
	}
//	$scope.fuckIos();
    }
);
