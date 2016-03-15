app.controller(
    'ticket_process_selecttickets_process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Division');        
	$scope.player_id = $state.params.playerId;
        $scope.tournament_name = $state.params.tournamentName;
        $scope.division_name = $state.params.divisionName;
	$scope.division_id = $state.params.divisionId;
	$scope.num_entrys = $state.params.numEntrys;

        $scope.count_keys = function(object_to_count){
            x = 0;
            for(i in object_to_count){
                x++;
            }
            return x;
        };

	StatusModal.loading()
	$http.post("[APIHOST]/player/"+$state.params.playerId+'/entry/division/'+$scope.division_id+'/numEntrys/'+$scope.num_entrys).success(
            function(data){
		StatusModal.loaded()
		$scope.status = "Ticket has been purchased for Tournament "+$scope.tournament_name;
		if ($scope.division_name!='all'){
		    $scope.status = $scope.status + ', Division '+$scope.division_name;
		}
            });                                
    })
