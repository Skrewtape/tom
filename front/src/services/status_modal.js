/*global app*/
angular.module('tom_services.status_modal', []);
angular.module('tom_services.status_modal')
    .factory('StatusModal',
	     ['$uibModal',
	      '$timeout',
	      '$state',
	      function($uibModal,$timeout,$state) {
		  var statusModalInstance = undefined;
		  var errorModalInstance = undefined;
		  var timeoutPromise = undefined;
		  var debug_msg = 'shit';
		  
		  close_status_modal = function(){
		      if(statusModalInstance!=undefined){
                          statusModalInstance.close();
                      }				    
		  }

		  // $scope.openModalWithController = function(templateUrl, controller){
		  //     return $uibModal.open({
		  //         templateUrl: templateUrl,
		  // 	controller: controller,		
		  //         backdrop: 'static',
		  //         keyboard: false,
		  //         scope: $scope                
		  //     });            
		  // };

		  openModalWithMessage = function(templateUrl,template_params){
		      return $uibModal.open({
			  templateUrl: templateUrl,
			  backdrop: 'static',
			  keyboard: false,
			  controller: function($scope){
			      for(key in template_params){
				  $scope[key] = template_params[key];
			      }
			  }	    
		      });            
		  };

		  openOkModalWithMessage = function(message){
		      return $uibModal.open({
			  templateUrl: 'services/ok_modal.html',
			  backdrop: 'static',
			  keyboard: false,
			  controller: function($scope){
			      $scope.message = message;
			  }	    
		      });            
		  };        			  
		  
		  
                  launch_status_modal = function(){
                      statusModalInstance = $uibModal.open({
                          templateUrl: 'services/status.html',
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
		  
		  launch_http_error_modal = function(error_message,goto_state){
		      close_status_modal();
                      modalInstance = $uibModal.open({
			  controller: function($scope){
			      $scope.error_message = error_message;
			  },
                          templateUrl: 'services/http_error.html',
                          backdrop: 'static',
                          size: 'md',
                          openedClass: 'modal_decorations',                
                          keyboard: false,
                      });
		      if(goto_state == undefined){
			  modalInstance.closed.then(function(){console.log('closing http error');$state.go('app')});
		      } else {
			  modalInstance.closed.then(function(){console.log('closing http error');$state.go(goto_state)});
		      }
                  };
		  
                  
                  return {
		      addDebugMsg: function(new_msg){
			  debug_msg=debug_msg+' -- '+new_msg;
		      },
	              loading: function(start_state) {
			  debug_msg=start_state;
			  launch_status_modal()
                      },
	              loaded: function(new_title) {
			  $timeout(close_status_modal,500);
                      },
		      http_error: launch_http_error_modal,
		      modalWithMessage: openModalWithMessage
                  };
              }
             ]);
