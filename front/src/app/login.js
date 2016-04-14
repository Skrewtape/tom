/*global app*/
app.controller(
    'LoginController',
    function($scope, $http, $uibModal, $location, $uibModalInstance, $state) {
        $scope.data = {};
        $scope.login = function() {
            $scope.modal = {};            
            $http.put('[APIHOST]/login', $scope.data,{timeout:5000}).success(
                function(put_data) {                                        
                    $http.get('[APIHOST]/user/current',{timeout:5000}).success(function (get_data) {
                        console.log('logged in');
                        $scope.$close('all done');
                    })
                }
            )
        };
    }
);
