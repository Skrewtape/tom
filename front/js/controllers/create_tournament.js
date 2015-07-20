/*global app*/
app.controller(
    'CreateTournamentController',
    function($scope, $http, $location, Page, $modal, $q
) {
	Page.set_title('Create Tournament');
	$scope.data = {};
	$scope.add_work = function() {
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
		$http.post('[APIHOST]/tournament', $scope.data).success(
			function(work) {
                $location.path('/');
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
        return $scope.data.name;
    };
});
