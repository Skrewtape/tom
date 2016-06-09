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
        $scope.stripe_dialog = function(){
            var handler = StripeCheckout.configure({
                key: 'pk_test_ogpldo01jdDiemTfT8MMTtMU',
                image: '/img/documentation/checkout/marketplace.png',
                locale: 'auto',
                token: function(token) {
                    console.log(token);
	            $http.post('[APIHOST]/sale',{stripeToken:token.id,addedTokens:$scope.added_tokens,email:token.email},{timeout:5000}).success(
		        function(data) {		                                
                            console.log(data);
		        }
	            );                    
                }
            });
            
            handler.open({
                name: 'Stripe.com',
                description: '2 widgets',
                amount: 2000
            });
        }
        
        $scope.max_unstarted_tickets = 5;
	$scope.added_tokens = {metadivisions:{},divisions:{},teams:{}};	
	$scope.change_division_tickets = Utils.change_division_tickets;
	
	$scope.get_metadivision_for_division = Utils.get_metadivision_for_division;
	$scope.division_in_metadivision = Utils.division_in_metadivision
	
        StatusModal.loading();        
	$scope.player_active_entries_count_promise = TimeoutResources.GetPlayerActiveEntriesCount(undefined,{player_id:$scope.player_id})	        
	$scope.metadivisions_promise = TimeoutResources.GetAllMetadivisions($scope.player_active_entries_count_promise)        
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.metadivisions_promise,{player_id:$scope.player_id})	
	$scope.player_promise = TimeoutResources.GetPlayer($scope.player_teams_promise,{player_id:$scope.player_id})	
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.player_promise);                
	$scope.player_tokens_promise = TimeoutResources.GetPlayerTokens($scope.tournaments_promise,{player_id:$scope.player_id});
	$scope.player_team_tokens_promise = TimeoutResources.GetPlayerTeamTokens($scope.player_tokens_promise,{player_id:$scope.player_id});

        
	$scope.player_team_tokens_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();	    
	    Utils.build_added_tokens($scope.resources.player_tokens,$scope.resources.player_team_tokens,$scope.added_tokens);
	    $scope.added_tokens.player_id = $scope.player_id
	    if($scope.resources.player_teams.teams.length>0){
		$scope.added_tokens.team_id = $scope.resources.player_teams.teams[0].team_id;
	    }
	    console.log($scope.resources.player_active_entries_count);
            // var form =  document.createElement("form");;
            // form.action = "http://192.168.1.178:8000/sale";
            // form.method = "POST";
            // var script =  document.createElement("script");
            // script.src = "https://checkout.stripe.com/checkout.js";
            // script.className = "stripe-button";
            // script.setAttribute("data-key", "pk_test_ogpldo01jdDiemTfT8MMTtMU");
            // script.setAttribute("data-image", "square-image.png");
            // script.setAttribute("data-name", "Demo Site");
            // script.setAttribute("data-description", "2 widgets ($20.00)");
            // script.setAttribute("data-amount", "1000");            
            // form.appendChild(script);
            // elem.append(angular.element(form));            
	    StatusModal.loaded();
	})
	
	
    }
).directive('purchaseTickets', function() {
    return {
	transclude: true,
	templateUrl: 'directives/purchase_tickets.html',
	controller: 'purchase_tickets'
    };
});;
