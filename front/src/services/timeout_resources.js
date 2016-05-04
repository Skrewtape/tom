/*global app*/
//poop page
angular.module('tom_services.timeout_resources', ['ngResource']);
angular.module('tom_services.timeout_resources').factory('TimeoutResources', function($resource,$q) {
    var all_active_tournaments_resource = $resource('[APIHOST]/tournament/active', null,
     		      {
     			  'getActiveTournaments': {method:'GET', 'timeout': 5000}
     		      })    
    var resource_results = {};
    var resources = {};    
    var timestamps = {};

    var resolved_promise = function(){
	var defer = $q.defer()
	defer.resolve();
	return defer.promise;
    }

    var check_resource_is_fresh = function(resource){
	if(timestamps[resource]!= undefined && Date.now() - 300000 > timestamps[resource]){
	    return true;
	} else {
	    return false;
	}
    }

    var generic_get_resource = function(res_name,scope_name,args){
	if(args == undefined){
	    args={}
	}
	resource_results[scope_name] = resources[res_name][res_name](args);
	timestamps[res_name] = Date.now();
	return resource_results[scope_name].$promise;	
    }

    function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
    
    var generic_resource = function(res_name,scope_name){
	return function(promise,args){
	    if(check_resource_is_fresh(res_name)){
		return resolved_promise();
	    }
	    if(promise != undefined){
		return promise.then(function(data){
		    for(arg_key in args){
			if(isFunction(args[arg_key])){
			    args[arg_key] = args[arg_key]();
			}
		    }		    
		    return generic_get_resource(res_name,scope_name,args);
		})
	    } else {
		return generic_get_resource(res_name,scope_name,args);
	    }
	}
    }
    
    resource_results['tournaments'] = undefined;
    resource_results['metadivisions'] = undefined;
    resource_results['player'] = undefined;
    resource_results['player_token'] = undefined;
    resource_results['players'] = undefined;
    resource_results['ifpa_player'] = undefined;
    resources['getActiveTournaments'] = $resource('[APIHOST]/tournament/active', null,
     						    {
     							'getActiveTournaments': {method:'GET', 'timeout': 5000}
     						    })    
    resources['getAllMetadivisions'] = $resource('[APIHOST]/metadivision', null,			     
						 {
						     'getAllMetadivisions': {method:'GET', 'timeout': 5000}
						 })
    resources['getPlayer'] =  $resource('[APIHOST]/player/:player_id', null,			     
					{
					    'getPlayer': {method:'GET', 'timeout': 5000}
					})
    resources['getPlayerTokens']= $resource('[APIHOST]/token/player_id/:player_id', null,			     
					       {
						   'getPlayerTokens': {method:'GET', 'timeout': 5000}
					       })
    resources['getAllPlayers'] = $resource('[APIHOST]/player', null,			     
			     {
				 'getAllPlayers': {method:'GET', 'timeout': 5000}
			     })
    resources['getIfpaPlayer'] = $resource('[APIHOST]/ifpa/:player_name', null,			     
			     {
				 'getIfpaPlayer': {method:'GET', 'timeout': 5000}
			     })
    
    
    return {
	GetAllResources: function(){
	    return resource_results;
	},
	GetPlayerNameSmushed: function(){
		return resource_results.player.first_name+resource_results.player.last_name;
	},
	GetAllMetadivisions: generic_resource('getAllMetadivisions','metadivisions'),
	GetActiveTournaments: generic_resource('getActiveTournaments','tournaments'),
	GetPlayer: generic_resource('getPlayer','player'),
	GetPlayerTokens: generic_resource('getPlayerTokens','player_tokens'),
	GetAllPlayers: generic_resource('getAllPlayers','players'),
	GetIfpaPlayer: generic_resource('getIfpaPlayer','ifpa_player'),
	getAllMetadivisionsResource: function(){
	    return $resource('[APIHOST]/metadivision', null,			     
			     {
				 'getAllMetadivisions': {method:'GET', 'timeout': 5000}
			     })	    
	},	
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
	getAllDivisionsResource: function(){
	    return $resource('[APIHOST]/division', null,
			     {
				 'getAllDivisions': {method:'GET', 'timeout': 5000}
			     })
	},
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
	},
	getTokensForPlayerResource: function(){
	    return $resource('[APIHOST]/token/player_id/:player_id', null,			     
			     {
				 'getTokensForPlayer': {method:'GET', 'timeout': 5000}
			     })	    
	},
	addTokensResource: function(){
	    return $resource('[APIHOST]/token', null,			     
			     {
				 'addTokens': {method:'POST', 'timeout': 5000}
			     })	    
	}
    };
});
