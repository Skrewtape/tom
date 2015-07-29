/*global angular, app*/
app.controller(
    'HomeController',
    function($scope, $http, $modal, $location, Page) {
        Page.set_title('Home');
        $scope.data = {};
        $http.get('[APIHOST]/tournament').success(
            function(data) {
                $scope.data.tournaments = data.tournaments;
            }
        );
        $scope.data.new_tournament = {};
        $scope.create_tournament = function() {
            if (!$scope.validData()) {
                return;
            }
            $scope.modal = {};
            var statusModal = $modal.open({
                templateUrl: 'modals/status.html',
                backdrop: 'static',
                keyboard: false,
                scope: $scope
            });
            $http.post('[APIHOST]/tournament', $scope.data.new_tournament).success(
                function(created) {
                    $scope.data.new_tournament = {};
                    $scope.data.tournaments.push(created);
                    statusModal.close();
                }
            ).error(
                function(data) {
                    $scope.modal.message = 'Failed to create tournament!';
                    if (data && data.message) {
                        $scope.modal.message += ' : ' + data.message;
                    }
                }
            );
        };
        $scope.validData = function() {
            return $scope.data.new_tournament.name;
        };
    }
);
