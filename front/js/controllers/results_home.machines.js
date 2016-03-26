app.controller(
    'results_home_machines',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
	$scope.change_nav_title('Machines');
	$scope.change_nav_menu();
        $scope.get_divisions = function(){
            $http.get('[APIHOST]/division',{timeout:5000}).success(
                function(data) {                    
		    console.log(data);
                    $scope.divisions = data;
		    StatusModal.loaded();
                }
            );
        };

	$scope.get_machines = function(){
            $http.get('[APIHOST]/machine',{timeout:5000}).success(
                function(data) {                    
                    $scope.machines = data;
		    $scope.get_divisions();		    
                }
            );
        };

	
        $scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament',{timeout:5000}).success(
                function(data) {
                    $scope.tournaments = data;
		    $scope.get_machines();
                }
            );
        };

	StatusModal.loading();
        $scope.get_tournaments();
                
    });
