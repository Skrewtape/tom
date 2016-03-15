app.controller(
    'ticket_process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Purchase Tickets');
        $scope.player_id =$state.params.playerId;

        $scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament',{timeout:5000}).success(
                function(data) {                    
                    $scope.tournaments = data;
                }
            );
        };

        $scope.get_player = function(){
            $http.get('[APIHOST]/player/'+$scope.player_id,{timeout:5000}).success(
                function(data) {                    
                    $scope.player = data;
                    $scope.get_tournaments();
                    
                }
            );
        };

        
        $http.get("[APIHOST]/player/"+$state.params.playerId+'/entry/open',{timeout:5000}).success(
            function(data){
                $scope.player_open_entries = data;
                $scope.get_player();
            });                                

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
        
        $scope.count_keys = function(object_to_count){
            x = 0;
            for(i in object_to_count){
                x++;
            }
            return x;
        };
        
        $scope.displayLinkToPurchase = function(division){
            entry_count = $scope.count_keys($scope.player_open_entries[division.division_id]);
            if(entry_count>=2){
                return false;
            }
            return true;
        };
    });
