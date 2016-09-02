angular.module('app.finals_activate.playerselect',['app.finals_activate.playerselect.process',/*REPLACEMECHILD*/]);
angular.module('app.finals_activate.playerselect').controller(
    'app.finals_activate.playerselect',
    function($scope, $state, StatusModal, TimeoutResources) {
        $scope.division_id=$state.params.divisionId;        
        $scope.num_qualifiers = parseInt($state.params.finalsNumberQualifiers);
        $scope.tournament_style = $state.params.finalsPlayerSelectionType;

        if($scope.tournament_style == "ppo"){
            $scope.num_qualifiers = $scope.num_qualifiers * 2;
        }                        
        
        $scope.num_byes = 8;
        $scope.check_too_many_checked_players = function(player){
            return false;
            //return player.checked == true && player.rank > $scope.num_qualifiers;            
        };
        $scope.check_too_many_ties = function(player){
            return false;
            //return player.checked == true && player.rank == $scope.num_qualifiers;
        };
        
        $scope.num_players_selected = 0;
        $scope.get_players_promise = TimeoutResources.GetAllPlayers();        
        if($scope.tournament_style != "ppo"){
            $scope.get_players_ranked_promise = TimeoutResources.GetPlayersRankedByQualifying($scope.get_players_promise,{division_id:$scope.division_id});
        } else {
            $scope.get_players_ranked_promise = TimeoutResources.GetPlayersRankedByQualifyingHerb($scope.get_players_promise,{division_id:$scope.division_id});
        }
        
        $scope.get_players_ranked_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            $scope.calc_num_selected();
            local_count = 0;            
            for(idx in $scope.resources.ranked_players.ranked_players){
                local_count = local_count+1;                    
                $scope.resources.ranked_players.ranked_players[idx].actual_order = local_count;
                if(idx < $scope.num_qualifiers){
                    console.log(idx);
                    $scope.resources.ranked_players.ranked_players[idx].checked = true;
                } else {
                    console.log(idx+ " " + $scope.num_qualifiers);                    
                }                                
            }       
            
        });
        $scope.abdivision = function(index){
            local_count = 0;
            for(idx in $scope.resources.ranked_players.ranked_players){                
                if (idx <= index && $scope.resources.ranked_players.ranked_players[idx].checked == true){
                    local_count = local_count + 1;
                }                 
            }
            if($scope.tournament_style == "ppo"){
                if(local_count==$scope.num_qualifiers/2 && $scope.resources.ranked_players.ranked_players[index].checked == true){
                    return true;
                }                             
            }
            if(local_count == $scope.num_qualifiers && $scope.resources.ranked_players.ranked_players[index].checked == true){
                return true;
            }                        
        };
        
        $scope.calc_num_selected = function(player){
            local_count = 0;
            // for(idx in $scope.resources.ranked_players.ranked_players){
            //     if($scope.resources.ranked_players.ranked_players[idx].checked == true){
            //         local_count = local_count+1;                    
            //         $scope.resources.ranked_players.ranked_players[idx].actual_order = local_count;
            //         if(local_count > 24){                    
            //             $scope.resources.ranked_players.ranked_players[idx].css_class = 'red';
            //         } else {
            //             //$scope.resources.ranked_players.ranked_players[idx].css_class = 'green';
            //         }       
            //     } else {
            //         $scope.resources.ranked_players.ranked_players[idx].css_class = undefined;
            //         $scope.resources.ranked_players.ranked_players[idx].actual_order = undefined;
            //     }
                
            // }
            $scope.num_players_selected.count = local_count;
            if(local_count > $scope.num_qualifiers){
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
