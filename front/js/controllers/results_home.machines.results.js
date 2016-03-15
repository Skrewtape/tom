app.controller(
    'results_home_machines_results',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
	$scope.machine_id=$state.params.machineId;
	$scope.machine_name=$state.params.machineName;
	console.log($state.current.name);
	$scope.add_to_bobo_breadcrumbs({route:$state.current.name,title:$scope.machine_name+" Scores"})

	$scope.get_rankings = function(){
            $http.get('[APIHOST]/machine/'+$scope.machine_id+'/rankings',{timeout:5000}).success(
                function(data) {
                    $scope.rankings = data.rankings;
		    StatusModal.loaded()
                }
            );
        };

	$scope.get_entries = function(){
            $http.get('[APIHOST]/entry/machineId/'+$scope.machine_id,{timeout:5000}).success(
                function(data) {
		    $scope.entries = data;
		    $scope.get_rankings();
                }
            );
        };	
	$scope.get_players = function(){
            $http.get('[APIHOST]/player',{timeout:5000}).success(
                function(data) {
                    $scope.players = data.players;
		    $scope.get_entries()
                }
            );
        };
	

	StatusModal.loading();
        $scope.get_players();

	//StatusModal.loading();
        //$scope.get_tournaments();
                
    });
