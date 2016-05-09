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

    var flush_resource_cache = function(resource_to_flush){
	if(resource_to_flush != undefined){
	    timestamps[resource_to_flush] = undefined;
	    return;
	}

	for(timestamp_key in timestamps){
	    timestamps[timestamp_key] = undefined;
	}
    }
    
    var check_resource_is_fresh = function(resource){
	return false
	if(timestamps[resource]!= undefined && Date.now() - 300000 > timestamps[resource]){
	    return true;
	} else {
	    return false;
	}
    }

    var generic_getdelete_resource = function(res_name,scope_name,args){
	if(args == undefined){
	    args={}
	}
	resource_results[scope_name] = resources[res_name][res_name](args);
	timestamps[res_name] = Date.now();
	return resource_results[scope_name].$promise;	
    }
    var generic_putpost_resource = function(res_name,scope_name,url_args,post_args){
	if(url_args == undefined){
	    url_args={}
	}
	if(post_args == undefined){
	    post_args={}
	}	
	resource_results[scope_name] = resources[res_name][res_name](url_args, post_args);
	timestamps[res_name] = Date.now();
	return resource_results[scope_name].$promise;	
    }
    

    function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    var generic_resource = function(res_name,scope_name,type,cache_resource){
	return function(promise,url_args,post_args,runtime_cache_override){
	    if(runtime_cache_override!=undefined){
		cache_resource==runtime_cache_override;
	    }
	    if(cache_resource==true && check_resource_is_fresh(res_name)){
		return resolved_promise();
	    }
	    if(promise == undefined){
		if(type == "get"){
		    return generic_getdelete_resource(res_name,scope_name,url_args);
		} else {
		    return generic_putpost_resource(res_name,scope_name,url_args,post_args);
		}
	    }	    
	    return promise.then(function(data){
	     	for(arg_key in url_args){
	     	    if(isFunction(url_args[arg_key])){
	     		url_args[arg_key] = url_args[arg_key]();
	     	    }
	     	}
		if(type == "get"){
	     	    return generic_getdelete_resource(res_name,scope_name,url_args);
		} else {
	     	    return generic_putpost_resource(res_name,scope_name,url_args,post_args);
		}
	    })
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
    resources['getPlayerTeamTokens']= $resource('[APIHOST]/token/teams/:player_id', null,			     
					       {
						   'getPlayerTeamTokens': {method:'GET', 'timeout': 5000}
					       })    
    resources['getAllPlayers'] = $resource('[APIHOST]/player', null,			     
			     {
				 'getAllPlayers': {method:'GET', 'timeout': 5000}
			     })
    resources['getIfpaPlayer'] = $resource('[APIHOST]/ifpa/:player_name', null,			     
			     {
				 'getIfpaPlayer': {method:'GET', 'timeout': 5000}
			     })
    resources['getPlayerTeams'] = $resource('[APIHOST]/team/player/:player_id', null,			     
			     {
				 'getPlayerTeams': {method:'GET', 'timeout': 5000}
			     })    
    resources['addTeam'] = $resource('[APIHOST]/team', null,			     
			     {
				 'addTeam': {method:'POST', 'timeout': 5000}
			     })

    resources['getAllDivisions'] =  $resource('[APIHOST]/division', null,
			 {
			     'getAllDivisions': {method:'GET', 'timeout': 5000}
			 })
    resources['getActiveMachines'] =  $resource('[APIHOST]/machine/active', null,
			 {
			     'getActiveMachines': {method:'GET', 'timeout': 5000}
			 })    
    resources['getAllPlayerEntries'] =  $resource('[APIHOST]/player/:player_id/entry/all', null,
			 {
			     'getAllPlayerEntries': {method:'GET', 'timeout': 5000}
			 })    
    resources['addTokens'] =  $resource('[APIHOST]/token', null,			     
					{
					    'addTokens': {method:'POST', 'timeout': 5000}
					})
    resources['changeScore'] =  $resource('[APIHOST]/score/:score_id', null,			     
					{
					    'changeScore': {method:'PUT', 'timeout': 5000}
					})	        
    resources['deleteScore'] =  $resource('[APIHOST]/score/:score_id', null,			     
					{
					    'deleteScore': {method:'DELETE', 'timeout': 5000}
					})
    resources['voidEntryToggle'] =  $resource('[APIHOST]/entry/:entry_id/void/:void_state', null,			     
					  {
					      'voidEntryToggle': {method:'PUT', 'timeout': 5000}
					  })
    resources['addMetadivision'] =  $resource('[APIHOST]/metadivision', null,			     
					  {
					      'addMetadivision': {method:'POST', 'timeout': 5000}
					  })
    resources['getRoles'] =  $resource('[APIHOST]/role', null,			     
					  {
					      'getRoles': {method:'GET', 'timeout': 5000}
					  })
    resources['addUser'] =  $resource('[APIHOST]/user', null,			     
					  {
					      'addUser': {method:'POST', 'timeout': 5000}
					  })
    resources['editPlayer'] =  $resource('[APIHOST]/player/:player_id', {player_id:'@player_id'},			     
			     {
				 'editPlayer': {method:'PUT','timeout': 5000}
			     })	
    resources['getTournament'] = $resource('[APIHOST]/tournament/:tournament_id', null,
			     {
				 'getTournament': {method:'GET', 'timeout': 5000}
			     })
    resources['getPlayerActiveEntriesCount'] = $resource('[APIHOST]/player/:player_id/entry/active_count', null,
			     {
				 'getPlayerActiveEntriesCount': {method:'GET', 'timeout': 5000}
			     })    
    resources['getDivision'] = $resource('[APIHOST]/division/:division_id', null,
			     {
				 'getDivision': {method:'GET', 'timeout': 5000}
			     })
    resources['setDivisionMachinePlayer'] =  $resource('[APIHOST]/machine/:division_machine_id/player/:player_id', {division_machine_id:'@division_machine_id',player_id:'@player_id'},  
			     {
				 'setDivisionMachinePlayer': {method:'PUT','timeout': 5000}
			     })	
    
    return {
	GetAllResources: function(){
	    return resource_results;
	},
	GetPlayerNameSmushed: function(){
	    return resource_results.player.first_name+resource_results.player.last_name;
	},
	GetPlayerLinkedTournamentId: function(){
	    return resource_results.player.linked_division.tournament_id;
	    //return 1;
	},
	AddMetadivision: generic_resource('addMetadivision','meta_division','post', false),	
	AddTeam: generic_resource('addTeam','team','post',false),
	AddTokens: generic_resource('addTokens','add_tokens_result','post', false),
	AddUser: generic_resource('addUser','user','post', false),
	ChangeScore: generic_resource('changeScore','score','post', false),
	DeleteScore: generic_resource('deleteScore','score','get', false),
	EditPlayer: generic_resource('editPlayer','edited_player','post', false),
	GetActiveMachines: generic_resource('getActiveMachines','machines','get',false),
	GetActiveTournaments: generic_resource('getActiveTournaments','tournaments','get',true),
	GetAllDivisions: generic_resource('getAllDivisions','divisions','get', true),
	GetAllMetadivisions: generic_resource('getAllMetadivisions','metadivisions','get',true),	
	GetAllPlayers: generic_resource('getAllPlayers','players','get',false),
	GetAllPlayerEntries: generic_resource('getAllPlayerEntries','player_entries','get',false),
	GetDivision: generic_resource('getDivision','division','get',true),		
	GetIfpaPlayer: generic_resource('getIfpaPlayer','ifpa_player','get',false),
	GetPlayer: generic_resource('getPlayer','player','get', false),
	GetPlayerActiveEntriesCount: generic_resource('getPlayerActiveEntriesCount','player_active_entries_count','get', false),
	GetPlayerTeams: generic_resource('getPlayerTeams','player_teams','get', false),
	GetPlayerTokens: generic_resource('getPlayerTokens','player_tokens','get', false),
	GetPlayerTeamTokens: generic_resource('getPlayerTeamTokens','player_team_tokens','get',false),
	GetRoles: generic_resource('getRoles','roles','get', true),
	GetTournament: generic_resource('getTournament','tournament','get',true),	
	SetDivisionMachinePlayer: generic_resource('setDivisionMachinePlayer','division_machine','post', false),	
	VoidEntryToggle: generic_resource('voidEntryToggle','entry','post', false),
	
	FlushResourceCache:flush_resource_cache,
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
