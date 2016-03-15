app.factory('myHttpInterceptor', function($q,$injector) {
    return {
	'responseError': function(rejection) {
	    console.log(rejection);
	    var StatusModal = $injector.get('StatusModal');
	    StatusModal.loaded();
	    if(rejection.status == -1){
		rejection.data={};
		rejection.data.message="HTTP Timeout while getting "+rejection.config.url
	    }
	    StatusModal.http_error('home','Server Error',rejection.data.message);
	    return $q.reject(rejection);
	}
    };
});



