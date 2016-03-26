app.controller(
    'results_home_divisions',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
	$scope.change_nav_menu();
	$scope.change_nav_title('Divisions');
        $scope.get_divisions = function(){
            $http.get('[APIHOST]/division',{timeout:5000}).success(
                function(data) {                    
                    $scope.divisions = data;
		    StatusModal.loaded();
                }
            );
        };

	
        $scope.get_tournaments = function(){
            $http.get('[APIHOST]/tournament',{timeout:5000}).success(
                function(data) {                    
                    $scope.tournaments = data;
		    $scope.get_divisions();
                }
            );
        };

	StatusModal.loading();
        $scope.get_tournaments();
                
    });
