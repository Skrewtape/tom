app.controller(
    'results_home_divisions',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        

        $scope.get_divisions = function(){
            $http.get('[APIHOST]/division').success(
                function(data) {                    
                    $scope.divisions = data;
		    StatusModal.loaded();
                }
            );
        };

	
        $scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament').success(
                function(data) {                    
                    $scope.tournaments = data;
		    $scope.get_divisions();
                }
            );
        };

	StatusModal.loading();
        $scope.get_tournaments();
                
    });
