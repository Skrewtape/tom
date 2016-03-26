app.controller(
    'results_home',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {
	Page.set_title('Results Home');
	$scope.random = Math.random();
	$scope.change_nav_menu();
	$scope.change_nav_title('Results Home');
	console.log($scope.navCollapsed.status);
    })
