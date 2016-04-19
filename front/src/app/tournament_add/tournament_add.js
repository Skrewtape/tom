angular.module('app.tournament_add',[]);
angular.module('app.tournament_add').controller(
    'app.tournament_add',
    function($scope, $http, $location, $state, Page, StatusModal, TimeoutResources) {
	$scope.tournament = {};

        $scope.create_tournament = function(){            
            StatusModal.loading();
	    var submit_data = angular.toJson($scope.tournament);
	    $scope.tournament = TimeoutResources.addTournamentResource().addTournament(submit_data);	    
	    $scope.tournament.$promise.then(function(data){
		StatusModal.loaded();		
	    })        
        };	
    }
);
