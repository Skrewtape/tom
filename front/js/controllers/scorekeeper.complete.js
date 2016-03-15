app.controller(
    'scorekeeper_complete',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal, $filter) {
        $scope.player_id=$state.params.playerId;
	$scope.entry_id = $state.params.entryId;

	$scope.get_machines = function(){
            $http.get('[APIHOST]/machine').success(
                function(data) {                    
                    $scope.machines = data;
		    StatusModal.loaded();
                }
            );
        };

	
	$scope.get_entry = function(){
            $http.get('[APIHOST]/entry/'+$scope.entry_id).success(
                function(data) {                    
		    $scope.entry = data;
		    $scope.get_machines();
                }
            );
        };

	
	$scope.get_player = function(){
            $http.get('[APIHOST]/player/'+$scope.player_id).success(
                function(data) {                    
		    $scope.player = data;
		    $scope.get_entry();
                }
            );
        };
	
	StatusModal.loading();
	$scope.get_player();	
    })
