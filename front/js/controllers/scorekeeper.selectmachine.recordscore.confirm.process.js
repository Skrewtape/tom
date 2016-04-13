app.controller(
    'scorekeeper_selectmachine_recordscore_confirm_process',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal, $filter) {
        $scope.player_id=$state.params.playerId;
	$scope.machine_id=$state.params.machineId;
	$scope.division_id=$state.params.divisionId;
	$scope.new_score = $state.params.newScore;
	$scope.entry_id = $state.params.entryId;
	$scope.displayBackButton.status = false;
	
	$scope.get_machine = function(){
            $http.get('[APIHOST]/machine/'+$scope.machine_id,{timeout:5000}).success(
                function(data) {                    
                    $scope.machine = data;
		    StatusModal.loaded();
                }
            );
        };
	
	$scope.get_player = function(){
            $http.get('[APIHOST]/player/'+$scope.player_id,{timeout:5000}).success(
                function(data) {                    
		    $scope.player = data;
		    $scope.get_machine();
                }
            );
        };

	
	$scope.set_score = function(){
            $http.post('[APIHOST]/entry/'+$scope.entry_id+'/machine/'+$scope.machine_id+'/score/'+$scope.new_score,{},{timeout:5000}).success(
                function(data) {                    
		    $scope.entry = data;
		    $scope.get_player();
                }
            ).error(
		function(data){
		    StatusModal.loaded();
		    $state.go('^.^');
		}
	    );
        };

	//$scope.openModalWithMessage('modals/score_confirm.html',error_message);
	StatusModal.loading();
	$scope.set_score();	

    })
