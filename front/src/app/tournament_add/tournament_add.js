//kilroy was here
angular.module('app.tournament_add',['app.tournament_add.process']);
angular.module('app.tournament_add').controller(
    'app.tournament_add',
    function($scope) {
	$scope.tournament = {};
    }
);
