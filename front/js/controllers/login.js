/*global app*/
app.controller(
    'LoginController',
    function($scope, $http, $modal, $location, $modalInstance, Page) {
        $scope.data = {};
        $scope.login = function() {
            $scope.modal = {};
            $http.put('[APIHOST]/login', $scope.data).success(
                function() {
                    $http.get('[APIHOST]/user/current').success(function (data) {
                        Page.set_logged_in_user(data);
                        $modalInstance.close();
                    });
                }
            ).error(
                function(data) {
                    $scope.modal.message = 'Login failed';
                    if (data && data.length) {
                        $scope.modal.message += ' : ' + data;
                    }
                }
            );
        };
    }
);
