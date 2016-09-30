angular.module('app.player_add',['app.player_add.process']);
angular.module('app.player_add').controller(
    'app.player_add',
    function($scope, $http, $location, $state, Page, StatusModal, TimeoutResources,$resource) {
	$scope.new_player = {};
        $scope.ifpa_results = {};
        $scope.ifpa_loading=false;
        $scope.get_ifpa_in_new_tab = function(){
            var url = "https://www.ifpapinball.com/ajax/searchplayer.php?search="+encodeURIComponent($scope.new_player.first_name+" "+$scope.new_player.last_name);
            window.open(url,'_blank');

        };
        $scope.get_ajax_ifpa= function(){
            $scope.ifpa_loading=true;
            $scope.ifpa_results = $resource('[APIHOST]/ifpa/:player_name',{player_name:""});
            $scope.ifpa_results.get({player_name:$scope.new_player.first_name+" "+$scope.new_player.last_name},function(data){
                $scope.ifpa_loading=false;
                $scope.ifpa_results = data;
                
        });
        };
    });

