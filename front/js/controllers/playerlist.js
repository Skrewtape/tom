app.controller(
    'playerlist',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
	$scope.change_nav_menu();
        console.log('poop');
	$scope.change_nav_title('Players');
        Page.set_title('List Players');        
        $scope.player_filter = undefined;
        $scope.players = undefined;
	StatusModal.loading('playerlist.js - get players')	
        $http.get('[APIHOST]/player',{timeout:5000}).success(
            function(data) {
                $scope.players = data.players;
                StatusModal.loaded();
            }
        );
        
    });
