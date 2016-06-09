/*
  controller : 
  get list of team tokens - done
  create list of added_tokens, with seperate bins for divisions, team_divisions, and meta_divisions - done

  Display : 
   for each active tournament {   
    display linked division if tournament is not single div
    display tournament name if single division, unless metadivision is set
    disabled if existing_tokens[type_of_tourney][div_id] == max tokens
    ngclick with division_id
   }
   ngclick {
    decide which added_token bucket to put token into based on : is it metadivision, is it team division, is it neither
   }
*/
//FIXME : handle multiple tournaments with multiple divisions
angular.module('tom_directives.purchase_tickets', []);
angular.module('tom_directives.purchase_tickets').controller(
    'purchase_tickets',function($scope, $state, StatusModal, TimeoutResources, Utils, $http){
        $scope.stripe_dialog = function(amount){
            var handler = StripeCheckout.configure({
                key: 'pk_test_ogpldo01jdDiemTfT8MMTtMU',
                image: 'http://cdn.marketplaceimages.windowsphone.com/v8/images/efd6e87a-ad46-49fd-bc4c-acdb2dd827aa?imageType=ws_icon_large',
                locale: 'auto',
                token: function(token) {
                    //StatusModal.loading();
                    $scope.ticket_purchase_in_progress = true;
	            $http.post('[APIHOST]/sale',{stripeToken:token.id,addedTokens:$scope.added_tokens,email:token.email},{timeout:5000}).success(
		        function(data) {		                                                            
                            //StatusModal.loaded();
                            $state.go('.process',{addedTokens:$scope.added_tokens});
		        }
	            ).error(function(data){
                        StatusModal.loaded();
                    });                    
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
            for(div_index in $scope.added_tokens.divisions){
                div_count = $scope.added_tokens.divisions[div_index];
                $scope.total_cost = $scope.total_cost + $scope.resources.divisions_costs[div_index]*div_count;
            }
        };
        
        $scope.change_division_tickets =  function(player_tokens,added_tokens,type,division_id,amount){
	    //player_tokens[type][division_id]=player_tokens[type][division_id]+amount;
	    added_tokens[type][division_id]=added_tokens[type][division_id]+amount;
            $scope.calculate_total_cost();
	};
        $scope.ticket_purchase_in_progress = false;
        $scope.max_unstarted_tickets = 5;
	$scope.added_tokens = {metadivisions:{},divisions:{},teams:{}};	
	//$scope.change_division_tickets = Utils.change_division_tickets;
	
	$scope.get_metadivision_for_division = Utils.get_metadivision_for_division;
	$scope.division_in_metadivision = Utils.division_in_metadivision
	
        StatusModal.loading();        
	$scope.division_cost_promise = TimeoutResources.GetDivTicketCostFromStripe();
        $scope.player_active_entries_count_promise = TimeoutResources.GetPlayerActiveEntriesCount($scope.division_cost_promise,{player_id:$scope.player_id});
	$scope.metadivisions_promise = TimeoutResources.GetAllMetadivisions($scope.player_active_entries_count_promise);        
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.metadivisions_promise,{player_id:$scope.player_id});	
	$scope.player_promise = TimeoutResources.GetPlayer($scope.player_teams_promise,{player_id:$scope.player_id});	
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.player_promise);                
	$scope.player_tokens_promise = TimeoutResources.GetPlayerTokens($scope.tournaments_promise,{player_id:$scope.player_id});
	$scope.player_team_tokens_promise = TimeoutResources.GetPlayerTeamTokens($scope.player_tokens_promise,{player_id:$scope.player_id});

        $scope.total_cost=0;
	$scope.player_team_tokens_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();	    
	    Utils.build_added_tokens($scope.resources.player_tokens,$scope.resources.player_team_tokens,$scope.added_tokens);
	    $scope.added_tokens.player_id = $scope.player_id;
	    if($scope.resources.player_teams.teams.length>0){
		$scope.added_tokens.team_id = $scope.resources.player_teams.teams[0].team_id;
	    }
	    console.log($scope.resources.player_active_entries_count);
	    StatusModal.loaded();
            
	});

        
	
    }
).directive('purchaseTickets', function() {
    return {
	transclude: true,
	templateUrl: 'directives/purchase_tickets.html',
	controller: 'purchase_tickets'
    };
});;
