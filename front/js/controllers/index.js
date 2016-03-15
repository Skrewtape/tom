/*global app*/
app.controller(
	'IndexController',    
    // ['$state',
    //  '$http',
     
    function($scope, $location, $http, Page,
             $state, $injector, $uibModal, StatusModal, $filter) {
	$scope.Page = Page;
        $scope.alerts = [];
	$scope.bobo_breadcrumbs=[];

	$scope.add_to_bobo_breadcrumbs = function(breadcrumb){
	    if($scope.bobo_breadcrumbs.length > 8){
		$scope.bobo_breadcrumbs.pop();
	    }
	    $scope.bobo_breadcrumbs.unshift(breadcrumb);
	}
	
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        
        $scope.addErrorAlert = function(msg) {
            $scope.alerts.push({msg: msg,type:'danger'});
        };
        
        $scope.logout = function() {
            StatusModal.loading();
	    $http.put('[APIHOST]/logout',{},{timeout:5000}).success(
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
            $scope.openModalWithController('modals/login.html','LoginController');
            //$scope.openModal('myModalContent.html','LoginController');
        };
        
        $http.get('[APIHOST]/user/current',{timeout:5000}).success(function (data) {
            Page.set_logged_in_user(data);
            $scope.$broadcast('login_changed');
        });

        $scope.openModalWithController = function(templateUrl, controller){
            return $uibModal.open({
                templateUrl: templateUrl,
		controller: controller,		
                backdrop: 'static',
                keyboard: false,
                scope: $scope                
            });            
	};

	$scope.count_keys = function(object_to_count){
            x = 0;
            for(i in object_to_count){
                x++;
            }
            return x;
        };

        $scope.openModalWithMessage = function(templateUrl,error_message){
	    $scope.error_message = error_message;
            return $uibModal.open({
                templateUrl: templateUrl,
                backdrop: 'static',
                keyboard: false,
                scope: $scope                
            });            
        };
        
        // $scope.close = function(thing){
        //     $scope.player_machine_setModal.dismiss('close');
        //     $state.go('^');
        // };
        $scope.truncateString = function(name,trunc_length){                        
	    
            if(name.length>trunc_length){
                return $filter('limitTo')(name,trunc_length)+'..';
            }
            return $filter('limitTo')(name,trunc_length);            
        };
	//possible errors : 400, 500, 409        
        $scope.voidEntry = function(entry_id){
            $scope.player_machine_setModal = $uibModal.open({
                templateUrl: 'modals/status.html',
                backdrop: 'static',
                keyboard: false,
                close:$scope.close,
                scope: $scope
            });            
            $http.put('[APIHOST]/entry/'+entry_id+'/void',{},{timeout:5000}).success(function (data) {                
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
require('./ticket.process.js');
require('./ticket.process.selecttickets.js');
require('./ticket.process.selecttickets.process.js');
require('./scorekeeper.js');
require('./scorekeeper.selectmachine.js');
require('./scorekeeper.selectmachine.genericplayersearch_selected.process.js');
require('./scorekeeper.selectmachine.recordscore.js');
require('./scorekeeper.selectmachine.recordscore.process.js');
require('./scorekeeper.complete.js');
require('./scorekeeper.complete.process.js');
require('./results_home.js');
require('./results_home.divisions.js');
require('./results_home.divisions.results.js');
require('./results_home.machines.js');
require('./results_home.machines.results.js');
require('./results_home.playerlist.results.js');
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
