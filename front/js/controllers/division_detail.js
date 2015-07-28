/*global angular, $, moment, app */
app.controller('DivisionDetailController', function(
	$scope, $http, $timeout, $modal, $routeParams, Page) {
        $scope.data = {};
        $scope.machine_cache = {};

        Page.set_title('Division Detail');

        $http.get('[APIHOST]/division/' + $routeParams.divisionId).success(
            function(data) {
                $scope.data.division = data;
                Page.set_title('Division: ' + data.name);
                $http.get(
                    '[APIHOST]/division/' +
                    $scope.data.division.division_id +
                    '/machine'
                ).then(function(response) {
                    $scope.data.machines = response.data.machines;
                });
            }
        );
        $scope.machine_search = function(substr) {
            return $http.get(
                '[APIHOST]/machine/search', {
                    params: {
                        substring: substr
                    }
                }
            ).then(function(response) {
                return response.data.machines;
            });
        };
        $scope.machine_selected = function(machine) {
            $http.put(
                '[APIHOST]/division/' +
                $scope.data.division.division_id +
                '/machine/' +
                machine.machine_id
            ).then(function(response) {
                $scope.data.machines = response.data.machines
            });
        };
        $scope.remove_machine = function(machine) {
            $http.delete(
                '[APIHOST]/division/' +
                $scope.data.division.division_id +
                '/machine/' +
                machine.machine_id
            ).then(function(response) {
                $scope.data.machines = response.data.machines
            });
        };            
    }
);
