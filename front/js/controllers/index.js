/*global app*/
app.controller(
	'IndexController',    
    // ['$state',
    //  '$http',
     
    function($scope, $location, $http, Page,
             $state, $injector, $uibModal, StatusModal) {
	$scope.Page = Page;
        $scope.alerts = [];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        
        $scope.addErrorAlert = function(msg) {
            $scope.alerts.push({msg: msg,type:'danger'});
        };
        
        $scope.logout = function() {
            StatusModal.loading();
	    $http.put('[APIHOST]/logout').success(
		function() {
                    StatusModal.loaded();
                    Page.set_logged_in_user({});
		    $location.path('/');
		}
	    ).error(
                function(){
                    //#FIXME : need a proper error notification system
                    StatusModal.loaded();
                    Page.set_logged_in_user({});
		    $location.path('/');                    
                }
            );
	};

        $scope.login = function() {
            $scope.openModal('modals/login.html','LoginController');
            //$scope.openModal('myModalContent.html','LoginController');
        };
        
        $http.get('[APIHOST]/user/current').success(function (data) {
            Page.set_logged_in_user(data);
            $scope.$broadcast('login_changed');
        });

        $scope.openModal = function(templateUrl, controller){
            return $uibModal.open({
                templateUrl: templateUrl,
                controller: controller,
                backdrop: 'static',
                keyboard: false,
                //close:$scope.close,
                scope: $scope                
            });            
        };
        
        // $scope.close = function(thing){
        //     $scope.player_machine_setModal.dismiss('close');
        //     $state.go('^');
        // };
        
        $scope.voidEntry = function(entry_id){
            $scope.player_machine_setModal = $uibModal.open({
                templateUrl: 'modals/status.html',
                backdrop: 'static',
                keyboard: false,
                close:$scope.close,
                scope: $scope
            });            
            $http.put('[APIHOST]/entry/'+entry_id+'/void').success(function (data) {                
                console.log('all gone');
                console.log(data);
                $scope.player_machine_setModal.close();
            });            
        };
    }
    //    ]
);

require('./login.js');
require('./playerlist.js');
require('./playeradd.js');
require('./playerlist.playeredit.js');
require('./playerlist.entryedit.js');
require('./playerlist.playeredit.process.js');
require('./tournament.js');
require('./division.js');
require('./genericplayerselect.js');
require('./ticket.purchase.js');
// require('./player.js');
// require('./ticketPlayerSelect.js');
// require('./ticketTournamentSelect.js');
// require('./ticketPurchase.js');

// require('./scorekeeper_tournament.js');
// require('./scorekeeper_division.js');
// require('./scorekeeper_machine.js');
// require('./scorekeeper_startgame.js');
// require('./scorekeeper_score.js');
// require('./scorekeeper_completegame.js');
// require('./generic_playersearch.js');
// require('./ticketPurchaseComplete.js');
// require('./reports.js');
// require('./reports_division.js');
// require('./reports_machine.js');
// require('./reports_players.js');
// require('./reports_player.js');
//require('./stats.js');
