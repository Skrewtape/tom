angular.module('app.player_purchasetickets',['app.player_purchasetickets.process',/*REPLACEMECHILD*/]);
angular.module('app.player_purchasetickets').controller(
    'app.player_purchasetickets',
    function($scope, $state, StatusModal, TimeoutResources,Page, Utils, $http) {
        $scope.added_tokens_metadivisions = {};
        $scope.added_tokens_divisions = {};
        $scope.added_tokens_teams = {};
        $scope.total_cost = 0;
	$scope.player_id=$state.params.playerId;
        
        // $scope.is_metadivision = function(tournament,division){
        //     return tournament.single_division == true  || division.division_id == $scope.resources.player.linked_division.division_id;
        // }

        $scope.stripe_dialog = function(amount){
            var handler = StripeCheckout.configure({
                key: 'pk_test_ogpldo01jdDiemTfT8MMTtMU',
                image: 'http://cdn.marketplaceimages.windowsphone.com/v8/images/efd6e87a-ad46-49fd-bc4c-acdb2dd827aa?imageType=ws_icon_large',
                locale: 'auto',
                token: function(token) {
                    //StatusModal.loading();
                    $scope.ticket_purchase_in_progress = true;
                    $scope.added_tokens = {};
                    $scope.added_tokens['divisions']=$scope.added_tokens_divisions;
                    $scope.added_tokens['metadivisions']=$scope.added_tokens_metadivisions;
                    $scope.added_tokens['teams']=$scope.added_tokens_teams;
                    $scope.added_tokens['player_id']=$scope.player_id;
                    if($scope.resources.player.team != undefined){
                        $scope.added_tokens['team_id']=$scope.resources.player.team.team_id;
                    } else {
                        $scope.added_tokens['team_id'] = undefined;
                    }
                    StatusModal.loading();
                    $state.go('.process',{addedTokens:$scope.added_tokens,stripeToken:token});                    
                }
            });
            
            handler.open({
                name: 'TOM Self Service',
                description: 'Purchase Tickets',
                amount: amount
            });
        }

        $scope.calculate_total_cost = function(){
            $scope.total_cost = 0;
            
            for(div_index in $scope.added_tokens_divisions){
                div_count = $scope.added_tokens_divisions[div_index];
                $scope.total_cost = $scope.total_cost + $scope.resources.divisions_costs[div_index]*div_count;
                
            }
            for(div_index in $scope.added_tokens_metadivisions){
                div_count = $scope.added_tokens_metadivisions[div_index];
                $scope.total_cost = $scope.total_cost + $scope.resources.divisions_costs[div_index]*div_count;
                
            }
            for(div_index in $scope.added_tokens_teams){
                div_count = $scope.added_tokens_teams[div_index];
                $scope.total_cost = $scope.total_cost + $scope.resources.divisions_costs[div_index]*div_count;
                
            }            
        };
        

        $scope.is_metadivision = function(tournament,division){
            return division.metadivision_id != undefined;
        }
        $scope.is_division = function(tournament,division){
            return division.metadivision_id == undefined && tournament.team_tournament == false && (tournament.single_division == true  || division.division_id == $scope.resources.player.linked_division.division_id);            
        }
        $scope.is_team_division = function(tournament,division){
            return tournament.team_tournament == true && $scope.resources.player.team != undefined
        }
        
        $scope.log_added_tokens = function(){
            console.log($scope.added_tokens_metadivisions);
        }
        
        $scope.player_id = $state.params.playerId;
        $scope.get_metadivision_for_division = Utils.get_metadivision_for_division;
        $scope.getMetadivisionTokens = function(div_id) {
            return $scope.resources['player_tokens']['metadivisions'][div_id]            
        };
        $scope.getDivisionTokens = function(div_id,metadiv_id) {
            if(metadiv_id != undefined && $scope.resources['player_tokens']['metadivisions'][metadiv_id] > 0){
                
                return $scope.resources['player_tokens']['metadivisions'][div_id]
                
            }
            if($scope.resources['player_team_tokens']['teams'][div_id] > 0){
                
                return $scope.resources['player_team_tokens']['teams'][div_id]                
            }
            
            if($scope.resources['player_tokens']['divisions'][div_id] > 0){
                
                return $scope.resources['player_tokens']['divisions'][div_id]
            }
            
        };        
        $scope.getActiveEntryCount = function(div_id) {
            return $scope.resources['player_active_entries_count'][div_id]
        };
        $scope.makeArray = function(num) {
            return new Array(num+1);   
        };
        StatusModal.loading();
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
        $scope.tom_config_promise = TimeoutResources.GetTomConfig();
	$scope.division_cost_promise = TimeoutResources.GetDivTicketCostFromStripe($scope.tom_config_promise);
        $scope.player_active_entries_count_promise = TimeoutResources.GetPlayerActiveEntriesCount($scope.division_cost_promise,{player_id:$scope.player_id});
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.metadivisions_promise,{player_id:$scope.player_id});	                
	$scope.player_tokens_promise = TimeoutResources.GetPlayerTokens($scope.tournaments_promise,{player_id:$scope.player_id});
	$scope.player_team_tokens_promise = TimeoutResources.GetPlayerTeamTokens($scope.player_tokens_promise,{player_id:$scope.player_id});        
	$scope.metadivisions_promise = TimeoutResources.GetAllMetadivisions($scope.player_team_tokens_promise);
        $scope.player_promise = TimeoutResources.GetPlayer($scope.metadivisions_promise,{player_id:$scope.player_id});
        $scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.player_promise);
        
        $scope.tournaments_promise.then(function(data){            
            $scope.resources = TimeoutResources.GetAllResources();
            $scope.max_unstarted_tickets = $scope.resources.tom_config.max_unstarted_tokens;
            StatusModal.loaded();            
            console.log($scope.resources);
        });
    }
);
