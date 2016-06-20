angular.module('app.finals_activate.playerselect',['app.finals_activate.playerselect.process',/*REPLACEMECHILD*/]);
angular.module('app.finals_activate.playerselect').controller(
    'app.finals_activate.playerselect',
    function($scope, $state, StatusModal, TimeoutResources) {
        $scope.division_id=$state.params.divisionId;
        $scope.num_players_selected = {count:0,css_class:undefined};
        $scope.get_players_promise = TimeoutResources.GetAllPlayers();
        $scope.get_players_ranked_promise = TimeoutResources.GetPlayersRankedByQualifying($scope.get_players_promise,{division_id:$scope.division_id});
        $scope.get_players_ranked_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            $scope.calc_num_selected();
        });
        $scope.calc_num_selected = function(){
            local_count = 0;
            for(idx in $scope.resources.ranked_players.ranked_players){
                if($scope.resources.ranked_players.ranked_players[idx].checked == true){
                    local_count = local_count+1;                    
                    $scope.resources.ranked_players.ranked_players[idx].actual_order = local_count;
                    if(local_count > 24){                    
                        $scope.resources.ranked_players.ranked_players[idx].css_class = 'red';
                    } else {
                        //$scope.resources.ranked_players.ranked_players[idx].css_class = 'green';
                    }       
                } else {
                    $scope.resources.ranked_players.ranked_players[idx].css_class = undefined;
                    $scope.resources.ranked_players.ranked_players[idx].actual_order = undefined;
                }
                
            }
            $scope.num_players_selected.count = local_count;
            if(local_count > 24){
                $scope.num_players_selected.css_class='red';
            } else {
                $scope.num_players_selected.css_class=undefined;
            }
        }
        //ng-click='start_finals(division.division_id)'
        
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});	    
    }
);
