/*global app*/
app.controller(
	'IndexController',    
    // ['$state',
    //  '$http',
     
    function($scope, $location, $http, Page,
             $state, $injector, $uibModal, StatusModal, $filter) {
	$scope.Page = Page;
	$scope.mobile_nav_title = {};
	$scope.mobile_nav_title.title = ' ';
	$scope.navCollapsed = {};
	$scope.navCollapsed.status = true;
        $scope.alerts = [];
	$scope.bobo_breadcrumbs=[];
	$scope.back_string = '^';
	$scope.back = function(){
	    $state.go($scope.back_string);
	}
	$scope.change_nav_menu = function(){
	    $scope.navCollapsed.status = true;
	}
	$scope.change_nav_title = function(title){
	    $scope.mobile_nav_title.title = title;
	}
	$scope.active_state = function(state_to_compare){
	    if (state_to_compare == $state.current.name){
		return true;
	    } else {
		return false;
	    }
	}
	
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
            StatusModal.loading('logout');
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
        $scope.voidEntry = function(entry_id,player){
	    $scope.entry_id_to_void = entry_id;	    
	    $scope.player = player;
            $scope.player_machine_setModal = $uibModal.open({
                templateUrl: 'modals/void_entry_from_score.html',
                backdrop: 'static',
                keyboard: false,
                close:$scope.close,
                scope: $scope
            });            
        };

	$scope.generic_http_req = function(url,method,scope_to_set,postput_data){
	    if(method !='get'){
		return $http[method](url,postput_data,{timeout:5000}).then(
		    function(data) {                    
			if(data.data[scope_to_set]==undefined){
			    $scope[scope_to_set] = data.data;
			} else {
			    $scope[scope_to_set] = data.data[scope_to_set];
			}
		    }
		);

	    } else {
		return $http[method](url,{timeout:5000}).then(
		    function(data) {
			if(data.data[scope_to_set]==undefined){
			    $scope[scope_to_set] = data.data;
			} else {
			    $scope[scope_to_set] = data.data[scope_to_set];
			}
		    }
		);
	    }
	}
	
	$scope.generic_http = function(url,scope_to_set,method,post_put_data,promise){
	    if(promise == undefined){
		// return $http[method](url,{timeout:5000}).success(
		//     function(data) {                    
		// 	$scope[scope_to_set] = data;
		//     }
		// );
		return $scope.generic_http_req(url,method,scope_to_set,post_put_data);
	    } else {
		return promise.then(function(){
		    $scope.generic_http_req(url,method,scope_to_set,post_put_data);
		})
	    }
	}	
	
	$scope.get_players = function(promise){
	    url_string = '[APIHOST]/player';
	    return $scope.generic_http(url_string,'players','get',promise);	    
	}

	$scope.get_asshole_players = function(promise){
	    url_string = '[APIHOST]/player/asshole';
	    return $scope.generic_http(url_string,'asshole_players','get',promise);	    
	}

	$scope.get_player = function(player_id,promise){
	    url_string = '[APIHOST]/player/'+player_id;
	    return $scope.generic_http(url_string,'player','get',promise);
        };

	$scope.deactivate_player = function(player_id,promise){
	    url_string = '[APIHOST]/player/'+player_id+'/deactivate';
	    return $scope.generic_http(url_string,'player','put',promise);
        };	
	
	$scope.clear_machine = function(player_id,machine_id,promise){
	    url_string = '[APIHOST]/machine/'+machine_id+'/player/'+player_id+'/clear';
	    return $scope.generic_http(url_string,'machine','put',promise);
        };

	$scope.get_all_params = function($local_scope){
	    for(param in $state.params){
		$local_scope[param] = $state.params[param];
	    }
	}
	
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
require('./scorekeeper.selectmachine.voidplayersearch.process.js');
require('./home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.js');
require('./home.scorekeeper.selectmachine.recordscore.player_is_an_asshole.process.js');
require('./scorekeeper.selectmachine.recordscore.js');
require('./scorekeeper.selectmachine.recordscore.confirm.js');
require('./scorekeeper.selectmachine.recordscore.void.js');
require('./scorekeeper.selectmachine.recordscore.confirm.process.js');
require('./scorekeeper.complete.js');
require('./scorekeeper.complete.void.js');
require('./scorekeeper.complete.process.js');
require('./results_home.js');
require('./results_home.divisions.js');
require('./results_home.divisions.results.js');
require('./results_home.machines.js');
require('./results_home.machines.results.js');
require('./results_home.playerlist.results.js');
require('./home.playeradd.purchase-multiple-tickets.js');
require('./home.playeradd.purchase-multiple-tickets.process.js');
require('./home.godassholesearch.js')
require('./home.godplayersearch.deactivate_player.js')
require('./home.godplayersearch.deactivate_player.process.js');

require('./home.poop.js')
require('./home.poop.shoop.js')
require('./home.poop.shoop.loop.js')

