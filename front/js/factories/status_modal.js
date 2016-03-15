/*global app*/
app.factory('StatusModal', ['$uibModal',
                            '$timeout',
                            '$state',
                            function($uibModal,$timeout,$state) {
                                var timeout_still_running = true;
                                var modalInstance = undefined;
                                var timeoutPromise = undefined;
                                launch_modal = function(){
                                    modalInstance = $uibModal.open({
                                        templateUrl: 'modals/status.html',
                                        backdrop: 'static',
                                        size: 'md',
                                        openedClass: 'modal_decorations',                
                                        keyboard: false,
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
	                            loading: function() {
                                        timeout_still_running = true;
                                        timeoutPromise = $timeout(launch_modal,1000);
                                        //launch_modal();
                                    },
	                            loaded: function(new_title) {
                                        $timeout.cancel(timeoutPromise);
                                        if(modalInstance!=undefined){
                                            modalInstance.close();
                                        }
                                    },
				    http_error: launch_http_error_modal
                                };
                            }
                           ]);
