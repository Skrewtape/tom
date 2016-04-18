angular.module('app.login',[]);
angular.module('app.login').controller(
    'app.login',
    function($scope, $http, $uibModal, $location, $state, Page, StatusModal,TimeoutResources) {
        $scope.login = function() {
	    StatusModal.loading();            
	    $scope.login = TimeoutResources.loginResource().login;
	    $scope.player = $scope.login($scope.data);
	    $scope.player.$promise.then(function(data){
		Page.set_logged_in_user($scope.player);
		StatusModal.loaded();
 		$state.go('app');		
	    });
        }
    }
);
