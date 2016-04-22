/*global app*/
//poop page
angular.module('tom_services.timeout_resources', ['ngResource']);
angular.module('tom_services.timeout_resources').factory('TimeoutResources', function($resource) {
    return {
	loginResource: function (){
	    return $resource('[APIHOST]/login', null,
			     {
				 'login': { method:'PUT' , 'timeout': 5000}
			     });
	},
	addTournamentResource: function(){
	    return $resource('[APIHOST]/tournament', null,
			     {
				 'addTournament': {method:'POST', 'timeout': 5000}
			     })
	},
	getTournamentsResource: function(){
	    return $resource('[APIHOST]/tournament', null,
			     {
				 'getTournaments': {method:'GET', 'timeout': 5000}
			     })
	},
	getTournamentResource: function(){
	    return $resource('[APIHOST]/tournament/:tournament_id', null,
			     {
				 'getTournament': {method:'GET', 'timeout': 5000}
			     })
	},
	addDivisionResource: function(){
	    return $resource('[APIHOST]/division', null,
			     {
				 'addDivision': {method:'POST', 'timeout': 5000}
			     })
	}
    };
});
