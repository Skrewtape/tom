/*global app*/
app.controller(
    'LoginController',
    function($scope, $http, $uibModal, $location, $uibModalInstance, Page, StatusModal, $state) {
        $scope.data = {};
        $scope.login = function() {
	    $scope.$close('hi there');
            $scope.modal = {};            
            StatusModal.loading();            
            $http.put('[APIHOST]/login', $scope.data,{timeout:5000}).success(
                function(put_data) {                                        
                    $http.get('[APIHOST]/user/current',{timeout:5000}).success(function (get_data) {
                        console.log('logged in');
                        StatusModal.loaded();
                        Page.set_logged_in_user(get_data);
                        $scope.$close('all done');
                        $state.go('home');
                    })
                }
            )// .error(
            //     function(data) {
            //         //#FIXME : need to close dialog and use normal alert
            //         console.log('logged in - not');
            //         StatusModal.loaded();
            //         $scope.addErrorAlert('Login was unsuccessfull.  Try again.');
            //         $scope.modal.message = 'Login failed';
            //         if (data && data.length) {
            //             $scope.modal.message += ' : ' + data;
            //         }
            //     }
            // );
        };
    }
);
