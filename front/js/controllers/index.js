/*global app*/
app.controller(
	'IndexController',
    function($scope, $location, $http, Page, $injector) {
		$scope.Page = Page;
		$scope.logout = function() {
			$http.put('[APIHOST]/logout').success(
				function() {
                    Page.set_logged_in_user({});
					$location.path('/');
				}
			);
		};
        $scope.login = function() {
            var modalInstance = $injector.get('$modal').open({
                templateUrl: 'modals/login.html',
                controller: 'LoginController',
                backdrop: 'static',
                keyboard: false,
            });
            modalInstance.result.then(function() {
                $injector.get('$route').reload();
            });
        };
        $http.get('[APIHOST]/user/current').success(function (data) {
            Page.set_logged_in_user(data);
            $scope.$broadcast('login_changed');
        });
	}
);

require('./tournament_detail.js');
require('./division_detail.js');
require('./home.js');
require('./login.js');
