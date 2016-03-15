app.controller(
    'playeredit',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {
        Page.set_title('Edit Players');
        $scope.changed = true;
        $scope.selected_division_in_tournament={};
        $scope.player_id =$state.params.playerId;
        
        $scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament',{timeout:5000}).success(
                function(data) {                    
                    $scope.tournaments = data;
                    console.log(data);
                }
            );
        };
        
        $http.get("[APIHOST]/player/"+$state.params.playerId,{timeout:5000}).success(
            function(data){                                
                $scope.player = data;
                console.log(data);                
                for(linked_div_index in $scope.player.linked_division){
                    linked_div = $scope.player.linked_division[linked_div_index];
                    $scope.selected_division_in_tournament[linked_div.tournament_id]=linked_div.division_id;
                }
                $scope.get_tournaments();
            }
        );

        
        $scope.divisionIsDisabled = function(tourn_id, div_name){
            for(linked_div_index in $scope.player.linked_division){
                linked_div = $scope.player.linked_division[linked_div_index];
                if(linked_div.tournament_id == tourn_id){
                    if(linked_div.name < div_name){
                        return true;
                    }                    
                }
            }
            return false;
        };
        $scope.onChange = function(tourn_id, div_name){
            $scope.changed = false;
            for(linked_div_index in $scope.player.linked_division){
                linked_div = $scope.player.linked_division[linked_div_index];
                if(linked_div.tournament_id == tourn_id){
                    if(linked_div.name > div_name){
                        $scope.voidModal = $uibModal.open({
                            templateUrl: 'modals/ticket_void.html',
                            backdrop: 'static',
                            keyboard: false,
                            close:$scope.close,
                            scope: $scope
                        });                
                    }
                }
            }
            
        };    
    });
