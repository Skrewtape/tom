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

        var loadSensitive = function() {
            if (Page.has_role('admin')) {
                $http.get('[APIHOST]/user').success(
                    function(data) {
                        $scope.data.users = data.users;
                    }
                );
                $http.get('[APIHOST]/role').success(
                    function(data) {
                        $scope.data.roles = data.roles;
                    }
                );
                $http.get('[APIHOST]/player').success(
                    function(data) {
                        $scope.data.players = data.players;
                    }
                );
            }
        }
        loadSensitive();
        $scope.$on('login_changed', loadSensitive);

        $scope.data.new_tournament = {};
        $scope.create_tournament = function() {
            if (!$scope.valid_new_tournament()) {
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
        $scope.valid_new_tournament = function() {
            return $scope.data.new_tournament.name;
        };

        $scope.data.new_user = {};
        $scope.data.new_user.roles = [];
        $scope.data.new_user_roles = {};
        $scope.create_user = function() {
            if (!$scope.valid_new_user()) {
                return;
            }
            $scope.modal = {};
            var statusModal = $modal.open({
                templateUrl: 'modals/status.html',
                backdrop: 'static',
                keyboard: false,
                scope: $scope
            });
            $http.post('[APIHOST]/user', $scope.data.new_user).success(
                function(created) {
                    $scope.data.new_user = {};
                    $scope.data.users.push(created);
                    statusModal.close();
                }
            ).error(
                function(data) {
                    $scope.modal.message = 'Failed to create user!';
                    if (data && data.message) {
                        $scope.modal.message += ' : ' + data.message;
                    }
                }
            );
        };
        $scope.valid_new_user = function() {
            return (
                $scope.data.new_user.username &&
                $scope.data.new_user.password &&
                $scope.data.new_user.email &&
                $scope.data.new_user.roles.length
            );
        };
        $scope.update_new_user_roles = function() {
            $scope.data.new_user.roles = [];
            angular.forEach($scope.data.new_user_roles, function(v, k) {
                if (v) {
                    $scope.data.new_user.roles.push(k);
                }
            });
        };

        $scope.data.new_player = {};
        $scope.create_player = function() {
            if (!$scope.valid_new_player()) {
                return;
            }
            $scope.modal = {};
            var statusModal = $modal.open({
                templateUrl: 'modals/status.html',
                backdrop: 'static',
                keyboard: false,
                scope: $scope
            });
            $http.post('[APIHOST]/player', $scope.data.new_player).success(
                function(created) {
                    $scope.data.new_player = {};
                    $scope.data.players.push(created);
                    statusModal.close();
                }
            ).error(
                function(data) {
                    $scope.modal.message = 'Failed to create player!';
                    if (data && data.message) {
                        $scope.modal.message += ' : ' + data.message;
                    }
                }
            );
        };
        $scope.valid_new_player = function() {
            return $scope.data.new_player.first_name && 
                $scope.data.new_player.last_name;
        };
    }
);
