/*global app*/
app.factory('StatusModal', ['$uibModal',
                            '$timeout',
                            '$state',
                            function($uibModal,$timeout,$state) {
                                var timeout_still_running = true;
                                var modalInstance = undefined;
                                var timeoutPromise = undefined;
                                launch_modal = function(){
                                    console.log('statusing...');
                                    modalInstance = $uibModal.open({
                                        templateUrl: 'modals/status.html',
                                        backdrop: 'static',
                                        size: 'md',
                                        openedClass: 'modal_decorations',                
                                        keyboard: false,
                                    });                                    
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
                                    }
                                };
                            }
                           ]);
