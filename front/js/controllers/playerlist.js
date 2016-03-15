app.controller(
    'playerlist',
    function($scope, $http, $uibModal, $state, $location, Page, StatusModal) {        
        console.log('poop');
        StatusModal.loading();
        Page.set_title('List Players');        
        $scope.player_filter = undefined;
        $scope.players = undefined;
        $http.get('[APIHOST]/player',{timeout:5000}).success(
            function(data) {
                $scope.players = data.players;
                StatusModal.loaded();
            }
        );
        
    });
