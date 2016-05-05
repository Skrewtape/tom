/*
  controller : 
  get list of tokens, with keys for active divisions - each token is "obj"
  create list of added_tokens, with seperate bins for divisions, team_divisions, and meta_divisions

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
    'purchase_tickets',function($scope, $state, StatusModal, TimeoutResources, Utils){
	$scope.max_unstarted_tickets = 5;
	$scope.added_tokens = {metadivisions:{},divisions:{}};	
	$scope.change_division_tickets = Utils.change_division_tickets;
	
	$scope.get_metadivision_for_division = Utils.get_metadivision_for_division;
	$scope.division_in_metadivision = Utils.division_in_metadivision
	
        StatusModal.loading();
	$scope.metadivisions_promise = TimeoutResources.GetAllMetadivisions()
	$scope.player_teams_promise = TimeoutResources.GetPlayerTeams($scope.metadivisions_promise,{player_id:$scope.player_id})	
	$scope.player_promise = TimeoutResources.GetPlayer($scope.player_teams_promise,{player_id:$scope.player_id})	
	$scope.tournaments_promise = TimeoutResources.GetActiveTournaments($scope.player_promise);
	$scope.player_tokens_promise = TimeoutResources.GetPlayerTokens($scope.tournaments_promise,{player_id:$scope.player_id});	
	$scope.player_tokens_promise.then(function(data){
	    $scope.resources = TimeoutResources.GetAllResources();	    
	    Utils.build_added_tokens($scope.resources.player_tokens,$scope.added_tokens);
	    StatusModal.loaded();
	})
	
    }
).directive('purchaseTickets', function() {
    return {
	transclude: true,

	templateUrl: 'directives/purchase_tickets.html'
    };
});;
