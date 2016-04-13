app.controller(
    'home_playeradd_purchase-multiple-tickets',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Select Tournament');
        $scope.player_id =$state.params.playerId;
	$scope.purchase_link_class = {};
	$scope.num_purchased_tickets = {};
	$scope.existing_num_tickets = {};
	$scope.counter = 0;
	$scope.disablePurchaseButton = true;

	$scope.get_player = function(){
            $http.get('[APIHOST]/player/'+$scope.player_id,{timeout:5000}).success(
                function(data) {                    
                    $scope.player = data;
		    StatusModal.loaded();
                }
            );
        };
	
        $scope.get_player_open_entries = function(){
	    $http.get("[APIHOST]/player/"+$state.params.playerId+'/entry/open',{timeout:5000}).success(
            function(data){
                $scope.player_open_entries = data;
		for(div_index in $scope.divisions){
		    div = data[div_index];
		    $scope.num_purchased_tickets[div_index]=0;
		    count_keys = $scope.count_keys($scope.player_open_entries[div_index]);
		    $scope.existing_num_tickets[div_index] = count_keys;
		    if($scope.checkMaxTicketsPurchased(div_index)){
			$scope.purchase_link_class[div_index] = 'list-group-item list-group-item-danger'
		    } else {
			$scope.purchase_link_class[div_index] = 'list-group-item list-group-item-success'
		    }
		}
		StatusModal.addDebugMsg('get player');		    		
                $scope.get_player();
            });                                	
	}
	
        $scope.get_divisions = function(){
            $http.get('[APIHOST]/division',{timeout:5000}).success(
                function(data) {
                    $scope.divisions = data;
		    StatusModal.addDebugMsg('get player open entries');		    		    
		    $scope.get_player_open_entries();
                }
            );
        };
	
        $scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament',{timeout:5000}).success(
                function(data) {
                    $scope.tournaments = data;
		    StatusModal.addDebugMsg('get divisons');		    
		    $scope.get_divisions();
                }
            );
        };        
	StatusModal.loading('home.playeradd.purchase-multiple-tickets.js - get tournaments')
	$scope.get_tournaments();

	$scope.checkSingleDivisionTournament = function(tournament){
            if(tournament.divisions[0].name == 'all'){
                return true;
            } else {
                return false;
            }            
        };

        $scope.checkPlayerLinkedDivision = function(tournament){
            if(tournament.divisions != undefined && tournament.divisions[0].name == 'all'){
                 return true;
            }
            if($scope.player.linked_division == null){
                return false;
            }
            for(linked_index in $scope.player.linked_division){
                linked_division = $scope.player.linked_division[linked_index];
                if(linked_division.tournament_id == tournament.tournament_id){
                    return true;
                } 
            }
            return false;
        };          
        
        $scope.matchPlayerLinkedDivision = function(division){            
            for(linked_index in $scope.player.linked_division){
                linked_division = $scope.player.linked_division[linked_index];
                if (linked_division.division_id == division.division_id){
                    return true;
                } 
            }
            return false;            
        };

	$scope.increment_number_tickets = function(division_id){
	    $scope.disablePurchaseButton = false;
	    $scope.num_purchased_tickets[division_id]=$scope.num_purchased_tickets[division_id]+1;
	    if($scope.num_purchased_tickets[division_id] + $scope.existing_num_tickets[division_id] >=2){
		$scope.purchase_link_class[division_id] = 'list-group-item list-group-item-danger'
	    }
	}
	
        $scope.checkMaxTicketsPurchased = function(division_id){
            entry_count = $scope.count_keys($scope.player_open_entries[division_id]);
            if(entry_count>=2){
                return true;
            }
            return false;
        };	
        
        $scope.displayLinkToPurchase = function(division){
            entry_count = $scope.count_keys($scope.player_open_entries[division.division_id]);
            if(entry_count>=2){
                return false;
            }
            return true;
        };

    });
