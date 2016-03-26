app.controller(
    'ticket_process_selecttickets_process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Purchase Tickets');        
	$scope.player_id = $state.params.playerId;
        $scope.tournament_name = $state.params.tournamentName;
        $scope.division_name = $state.params.divisionName;
	$scope.division_id = $state.params.divisionId;
	$scope.num_entrys = $state.params.numEntrys;
	$scope.displayBackButton.status = false;
        $scope.count_keys = function(object_to_count){
            x = 0;
            for(i in object_to_count){
                x++;
            }
            return x;
        };

	StatusModal.loading()
	$http.post("[APIHOST]/player/"+$state.params.playerId+'/entry/division/'+$scope.division_id+'/numEntrys/'+$scope.num_entrys,{},{timeout:5000}).success(
            function(data){
		StatusModal.loaded()
		if($scope.num_entrys==2){
		    $scope.status = "2 Tickets have ";
		} else {
		    $scope.status = "1 Ticket has ";
		}
		$scope.status = $scope.status + "been purchased for Tournament "+$scope.tournament_name;
		if ($scope.division_name!='all'){
		    $scope.status = $scope.status + ', Division '+$scope.division_name;
		}
            });                                
    })
