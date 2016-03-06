app.controller(
    'genericplayerselect',
    function($scope, $http, $timeout, $state, $location, $filter, Page) {        
        Page.set_title('Purchase Tickets');                
        $http.get('[APIHOST]/player').success(
            function(data) {
                $scope.players = data.players;                
            }
        );
        $scope.player = {player_id:''};
        
        $scope.onKeyPressed = function(data,event) {
            if (data == '<') {
                $scope.player.player_id = $scope.player.player_id.slice(0, $scope.player.player_id.length - 1);
            } else {
                $scope.player.player_id += data;                
            }
            console.log($scope.player.player_id+' '+$scope.player.player_id.length);
            if($scope.player.player_id.length < 3){
                $scope.popoverIsOpen = false;
                return;
            }
            $scope.selected_players = $filter('filter')($scope.players,$scope.player.player_id,$scope.player_comparator);
            if($scope.selected_players.length>0){
                first_name = $scope.selected_players[0].first_name;
                last_name = $scope.selected_players[0].last_name;
                $scope.keypad_player_name = first_name +' '+last_name;
                $scope.popoverIsOpen = true;
                $scope.select_player = $scope.selected_players[0];
            } else {
                $scope.keypad_player_name = 'does not exist';                
                $scope.popoverIsOpen = true;
                $scope.select_player = undefined;
            }
            console.log($scope.keypad_player_name);
        };
    }
);
