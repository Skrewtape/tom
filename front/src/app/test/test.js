angular.module('app.test',[/*REPLACEMECHILD*/]);
angular.module('app.test').controller(
    'app.test',
    function($scope, $state, StatusModal, TimeoutResources) {
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});
        $scope.whatever = function(){
            console.log('hi there '+$scope.poop);
            commas = $scope.poop.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            console.log(commas);
            
        }
        $scope.format_with_commas = function(){
            $scope.poop = $scope.poop.replace(/\,/g,'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }
    }
);
