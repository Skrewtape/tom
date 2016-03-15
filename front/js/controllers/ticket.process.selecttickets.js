app.controller(
    'ticket_process_selecttickets',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Division');        
	$scope.player_id = $state.params.playerId;
        $scope.tournament_name = $state.params.tournamentName;
        $scope.division_name = $state.params.divisionName;
        $scope.division_id = $state.params.divisionId;

	
        $scope.count_keys = function(object_to_count){
            x = 0;
            for(i in object_to_count){
                x=x+1;
		console.log('found one');
            }
            return x;
        };

	
        $scope.get_player = function(){
            $http.get('[APIHOST]/player/'+$scope.player_id).success(
                function(data) {                    
                    $scope.player = data;                    
                }
            );
        };
	
	$http.get("[APIHOST]/player/"+$state.params.playerId+'/entry/open').success(
            function(data){
		console.log(data)
                $scope.player_open_entries = data;
		$scope.entry_count = $scope.count_keys(data[$scope.division_id]);
                $scope.get_player();
            });                                
    })
