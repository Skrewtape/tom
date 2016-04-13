app.controller(
    'home.poop.shoop.loop',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {
        Page.set_title('');
        //$scope.back_string = '';
	$scope.parent_state = $state.get('^');
	$scope.get_all_params($scope);
	console.log($scope.extraThing);
	
})
