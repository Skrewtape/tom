app.controller(
    'ticketplayerselect',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Division');        

        $scope.player = {};
        
        $scope.add_machine = function(division){
            StatusModal.loading();
            $http.put('[APIHOST]/division/'+division.division_id+'/machine/'+$scope.division.new_machine.machine_id,{},{timeout:5000}).success(
                function(data) {
                    StatusModal.loaded();
                    $scope.division.new_machine_id = undefined;
                    $scope.division.machines.unshift(data);
                }
            );                        
        };
        
        $scope.get_division = function(division_id){
            $http.get('[APIHOST]/division/'+division_id,{timeout:5000}).success(
                function(data) {
                    $scope.division = data;                
                }
            );            
        };

        $scope.get_machines = function(){
            $http.get("[APIHOST]/machine",{timeout:5000}).success(
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


        $scope.get_machines();
        
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
