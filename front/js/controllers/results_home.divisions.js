app.controller(
    //    'results_home_divisions',
    'results_home.divisions',
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
		    StatusModal.addDebugMsg('get divisions');		    
		    $scope.get_divisions();
                }
            );
        };

	StatusModal.loading('results_home.divisions.js - get tournaments');
        $scope.get_tournaments();
                
    });
