app.controller(
    'scorekeeperselectmachine',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Scorekeeping');
	$scope.division_id=$state.params.divisionId;
        $scope.get_tournament = function(){
            $http.get('[APIHOST]/tournament/'+$scope.division.tournament_id,{timeout:5000}).success(
                function(data) {                    
                    $scope.tournament = data;
		    StatusModal.loaded();
                }
            );
        };
        $scope.get_division = function(){
            $http.get('[APIHOST]/division/'+$scope.division_id,{timeout:5000}).success(
                function(data) {                    
                    $scope.division = data;
		    $scope.get_tournament()
                }
            );
        };

	StatusModal.loading();
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
