//kilroy was here
angular.module('app.tournament_add',['app.tournament_add.process']);
angular.module('app.tournament_add').controller(
    'app.tournament_add',
    function($scope,TimeoutResources, StatusModal) {
	$scope.tournament = {scoring_type:'papa'};
        $scope.form_division = $scope.tournament;
        $scope.tom_config_promise = TimeoutResources.GetTomConfig();
        StatusModal.loading();
        $scope.tom_config_promise.then(function(data){
            $scope.resources = TimeoutResources.GetAllResources();
            StatusModal.loaded();
        });
    }
);
