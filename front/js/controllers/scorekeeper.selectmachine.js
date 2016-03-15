app.controller(
    'scorekeeperselectmachine',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Purchase Tickets');
	$scope.division_id=$state.params.divisionId;
        $scope.get_division = function(){
            $http.get('[APIHOST]/division/'+$scope.division_id).success(
                function(data) {                    
                    $scope.division = data;
                }
            );
        };

        $scope.get_division();
        
        $scope.checkSingleDivisionTournament = function(tournament){
            if(tournament.divisions[0].name == 'all'){
                return true;
            } else {
                return false;
            }            
        };
                
        $scope.count_keys = function(object_to_count){
            x = 0;
            for(i in object_to_count){
                x++;
            }
            return x;
        };
        
    });
