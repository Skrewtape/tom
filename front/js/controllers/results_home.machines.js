app.controller(
    'results_home_machines',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        

        $scope.get_divisions = function(){
            $http.get('[APIHOST]/division').success(
                function(data) {                    
		    console.log(data);
                    $scope.divisions = data;
		    StatusModal.loaded();
                }
            );
        };

	$scope.get_machines = function(){
            $http.get('[APIHOST]/machine').success(
                function(data) {                    
                    $scope.machines = data;
		    $scope.get_divisions();		    
                }
            );
        };

	
        $scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament').success(
                function(data) {
                    $scope.tournaments = data;
		    $scope.get_machines();
                }
            );
        };

	StatusModal.loading();
        $scope.get_tournaments();
                
    });
