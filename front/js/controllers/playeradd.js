app.controller(
    'playeradd',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {
        Page.set_title('Add Players');

        $scope.new_player = {};

	StatusModal.loading('playeradd.js - get latest players')
	$http.get('[APIHOST]/player/latest_players/10',{timeout:5000}).success(
	    function(data){
		console.log(data);
		StatusModal.loaded();
		$scope.players=data.players;
	    }
	);
        $scope.valid_new_player = function() {
            return $scope.new_player.first_name && 
                $scope.new_player.last_name;
        };

        $scope.create_player = function() {
            if (!$scope.valid_new_player()) {
                return;
            }
            StatusModal.loading('playeradd.js - add player');            
	    
            $http.post('[APIHOST]/player', $scope.new_player,{},{timeout:5000}).success(
                function(created) {
                    $scope.new_player = {};
                    $scope.players.unshift(created);
                    StatusModal.loaded();
                }
            ).error(
                function(data) {
                    StatusModal.loaded();
                    if (data && data.message) {
                        //add alert
                    }
                }
            );
        };
    });
