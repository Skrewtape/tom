app.controller(
    'home.godassholesearch',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
	$scope.change_nav_menu();
        Page.set_title('List Asshole Players');        
        $scope.player_filter = undefined;
//        $scope.players = undefined;
	StatusModal.loading('home.godassholesearch.js - get players')	
	$scope.get_asshole_players().then(function(){
	    StatusModal.loaded();
	})
    });
