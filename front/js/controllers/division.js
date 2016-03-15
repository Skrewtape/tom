app.controller(
    'division',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Division');        
        $scope.tournament_name = $state.params.tournament_name;
        $scope.division_id = $state.params.division_id;

        $scope.add_machine = function(division){
            StatusModal.loading();
	    //possible errors : 400, 500, 409
            $http.put('[APIHOST]/division/'+division.division_id+'/machine/'+$scope.division.new_machine.machine_id).success(
                function(data) {
                    $scope.division.new_machine_id = undefined;
                    $scope.division.machines.unshift(data);
		    StatusModal.loaded();		    
                }
            );                        
        };

        //possible errors : 400, 500, 409
        $scope.get_division = function(division_id){
            $http.get('[APIHOST]/division/'+division_id,{timeout:5000}).success(
                function(data) {
                    $scope.division = data;                
                }
            );            
        };

	//possible errors : 500	
        $scope.get_machines = function(){
            $http.get("[APIHOST]/machine").success(
                function(data){
                    $scope.machines = data;
                    $scope.machines_array = [];
                    for(machine_index in $scope.machines){
                        machine = $scope.machines[machine_index];
                        $scope.machines_array.push(machine);
                    }
                    $scope.get_division($scope.division_id);
                }
            );
        };

	StatusModal.loading();
        $scope.get_machines();
        //possible errors : 400, 500, 409
        $scope.remove_machine = function(division_id,machine){
            StatusModal.loading();
            $http.delete('[APIHOST]/division/'+division_id+'/machine/'+machine.machine_id).success(
                    function(done) {                        
                        $scope.division.machines.splice($scope.division.machines.indexOf(machine),1);
                        StatusModal.loaded();
                    }
                );                            
        };
        
        
    });
