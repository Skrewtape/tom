app.controller(
    'playereditprocess',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {
        Page.set_title('Edit Players');
        $scope.changed = true;
        $scope.selected_division_in_tournament={};
        $scope.player_id =$state.params.playerId;
        $scope.tournament_id =$state.params.tournamentId;
        $scope.division_id =$state.params.divisionId;

        
        $scope.edit_player = function(){            
            if ($scope.has_tournament_division_changed($scope.tournament_id,$scope.division_id)){
                $http.put('[APIHOST]/player/'+$scope.player_id,{linked_division:$scope.division_id}).success(
                    function(data){
                        
                        $scope.division_set='true';
                        StatusModal.loaded();            
                    }
                ).error(
                    function(data){
                    $scope.division_set='false';
                    StatusModal.loaded();
                    }
                );
            } else {                
                $scope.division_set='null';
                StatusModal.loaded();
            }
            
        };        

        
        StatusModal.loading();                
        $http.get("[APIHOST]/player/"+$state.params.playerId).success(
            function(data){                                                
                $scope.player = data;
                $scope.edit_player();
            }
        ).error(
            function(data){
                console.log(data);
            }
        );        

        $scope.has_tournament_division_changed = function(tournament_id, division_id){            
            if ( $scope.player.linked_division == null){                
                return true;
            }
            
            for(linked_div_index in $scope.player.linked_division){
                linked_div = $scope.player.linked_division[linked_div_index];
                if(linked_div.division_id == division_id){
                    return false;
                };
            }
            
            return true;
        };
        
    });
