angular.module('app.test',[/*REPLACEMECHILD*/]);
angular.module('app.test').controller(
    'app.test',
    function($scope, $state, StatusModal, TimeoutResources,$location) {
	//$scope.player_info=$state.params.newPlayerInfo;
	//if($scope.checkForBlankParams($scope.player_info) == true){
	//    return;
	//}
	//$scope.player_promise = TimeoutResources.AddPlayer(undefined,{/*get_params*/},{/*post_data*/});
        $scope.void_button_class="green";
        ip = $location.search().ip;
        console.log(ip);
        $scope.get_some = function(){
            if($scope.void_button_class == "red"){
                $state.go("^");
            }            
            if($scope.void_button_class == "green"){
                $scope.void_button_class="red";
            }
        }
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
