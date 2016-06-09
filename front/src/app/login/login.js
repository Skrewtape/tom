angular.module('app.login',[]);
angular.module('app.login').controller(
    'app.login',
    function($scope, $http, $uibModal, $location, $state, Page, StatusModal,TimeoutResources) {
        $scope.login = function() {
	    StatusModal.loading();            
	    //$scope.login = TimeoutResources.loginResource().login;
	    //$scope.player = $scope.login($scope.data);
            //	    $scope.player.$promise.then(function(data){
            $scope.login_promise = TimeoutResources.Login(undefined,{},$scope.data);
            $scope.login_promise.then(function(data){
                $scope.resources = TimeoutResources.GetAllResources();
		Page.set_logged_in_user($scope.resources.logged_in_user);
		StatusModal.loaded();
 		$state.go('app');		
            });
        };
    }
);
