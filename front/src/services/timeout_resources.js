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
	getAllTournamentsResource: function(){
	    return $resource('[APIHOST]/tournament', null,
			     {
				 'getAllTournaments': {method:'GET', 'timeout': 5000}
			     })
	},
	getActiveTournamentsResource: function(){
	    return $resource('[APIHOST]/tournament/active', null,
			     {
				 'getActiveTournaments': {method:'GET', 'timeout': 5000}
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
				 //FIXME : need to standardize return format - specifically
				 //        need to always return dict's, even in things that
				 //        are sub-objects (i.e. list of machines under division
				 //        should be a dict, not an array ).  We can do 
				 //        response massaging at the resourc
				 'addDivision': {method:'POST', 'timeout': 5000}
			     })
	},
	getDivisionResource: function(){
	    return $resource('[APIHOST]/division/:division_id', null,
			     {
				 'getDivision': {method:'GET', 'timeout': 5000}
			     })
	},
/*	getAllDivisionResource: function(){
	    return $resource('[APIHOST]/division', null,
			     {
				 'getAllDivisions': {method:'GET', 'timeout': 5000}
			     })
	},*/
	getAllMachinesResource: function(){
	    return $resource('[APIHOST]/machine', null,
			     {
				 'getAllMachines': {method:'GET', 'timeout': 5000}
			     })
	},
	getAllMachinesArrayResource: function(){
	    return $resource('[APIHOST]/machine', null,
			     {
				 'getAllMachinesArray': {
				     method:'GET',
				     'timeout': 5000,
				     isArray:true,
				     transformResponse:function(data,headersGetter){
					 machines_array = [];
					 machines_dict = angular.fromJson(data);
					 for(machine_index in machines_dict){
					     machine = machines_dict[machine_index];
					     machines_array.push(machine);
					 }
					 return machines_array;
				     }
				 }
			     })
	},
	addMachineToDivisionResource: function(){
	    return $resource('[APIHOST]/division/:division_id/machine/:machine_id', {division_id:'@division_id',machine_id:'@machine_id'},
			     {
				 'addMachineToDivision': {method:'PUT', 'timeout': 5000}
			     })
	},
	removeMachineFromDivisionResource: function(){
	    return $resource('[APIHOST]/division_machine/:division_machine_id', {division_machine_id:'@division_machine_id'},
			     {
				 'removeMachineFromDivision': {method:'DELETE', 'timeout': 5000}
			     })
	},
	enableMachineInDivisionResource: function(){
	    return $resource('[APIHOST]/division_machine/:division_machine_id', {division_machine_id:'@division_machine_id'},
			     {
				 'enableMachineInDivision': {method:'PUT', 'timeout': 5000}
			     })
	},
	addPlayerResource: function(){
	    return $resource('[APIHOST]/player', null,			     
			     {
				 'addPlayer': {method:'POST', 'timeout': 5000}
			     })
	},
	getPlayerResource: function(){
	    return $resource('[APIHOST]/player/:player_id', null,			     
			     {
				 'getPlayer': {method:'GET', 'timeout': 5000}
			     })
	},
	editPlayerResource: function(){
	    return $resource('[APIHOST]/player/:player_id', {player_id:'@player_id'},			     
			     {
				 'editPlayer': {method:'PUT','timeout': 5000}
			     })
	},
	toggleTournamentActiveResource: function(){
	    return $resource('[APIHOST]/tournament/:tournament_id/:action', {tournament_id:'@tournament_id',action:'@action'},			     
			     {
				 'toggleTournamentActive': {method:'PUT','timeout': 5000}
			     })
	}	
    };
});
