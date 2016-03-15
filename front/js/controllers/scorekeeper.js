app.controller(
    'scorekeeper',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        Page.set_title('Purchase Tickets');

        $scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament').success(
                function(data) {                    
                    $scope.tournaments = data;
                }
            );
        };

        $scope.get_tournaments();
        
        $scope.checkSingleDivisionTournament = function(tournament){
	    console.log('poop');
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
