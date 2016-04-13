/*global app*/
app.factory('StatusModal', ['$uibModal',
                            '$timeout',
                            '$state',
                            function($uibModal,$timeout,$state) {
                                var timeout_still_running = true;
                                var modalInstance = undefined;
                                var timeoutPromise = undefined;
				var debug_msg = 'shit';

				close_modal = function(){
                                    if(modalInstance!=undefined){
                                        modalInstance.close();
                                    }				    
				}
                                launch_modal = function(){
                                    modalInstance = $uibModal.open({
                                        templateUrl: 'modals/status.html',
                                        backdrop: 'static',
                                        size: 'md',
                                        openedClass: 'modal_decorations',                
                                        keyboard: false,
					controller: function($scope){
					    $scope.debug_msg = debug_msg;
					    $scope.display_debug_msg = function(){
						$scope.displayDebugMsg = true;
					    }
					}
                                    });                                    
                                };
				launch_http_error_modal = function(next_state, title, error_message){
                                    modalInstance = $uibModal.open({
					controller: function($scope){
					    $scope.error_message = error_message;
					},
                                        templateUrl: 'modals/http_error.html',
                                        backdrop: 'static',
                                        size: 'md',
                                        openedClass: 'modal_decorations',                
                                        keyboard: false,
                                    });
				    modalInstance.closed.then(function(){$state.go(next_state)});                                    
                                };
		
                                
                                return {
				    addDebugMsg: function(new_msg){
					debug_msg=debug_msg+' -- '+new_msg;
				    },
	                            loading: function(start_state) {
                                        timeout_still_running = true;
					debug_msg=start_state;
                                        //timeoutPromise = $timeout(launch_modal,0);
					launch_modal()

                                        //launch_modal();
                                    },
	                            loaded: function(new_title) {
                                        //$timeout.cancel(timeoutPromise);
                                        //if(modalInstance!=undefined){
                                        //    modalInstance.close();
                                        //}
					$timeout(close_modal,500);
                                    },
				    http_error: launch_http_error_modal
                                };
                            }
                           ]);
