/*global app*/
//poop page
angular.module('tom_services.timeout_resources', ['ngResource']);
angular.module('tom_services.timeout_resources').factory('TimeoutResources', function($resource,$q) {
    var all_active_tournaments_resource = $resource('[APIHOST]/tournament/active', null,
     		      {
     			  'getActiveTournaments': {method:'GET', 'timeout': 15000}
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

    machineDictToArray = function(data,headersGetter){
	machines_array = [];
	machines_dict = angular.fromJson(data);
	for(machine_index in machines_dict){
	    machine = machines_dict[machine_index];
	    machines_array.push(machine);
	}
	return machines_array;
    }
    
    resource_results['tournaments'] = undefined;
    resource_results['metadivisions'] = undefined;
    resource_results['player'] = undefined;
    resource_results['player_token'] = undefined;
    resource_results['players'] = undefined;
    resource_results['ifpa_player'] = undefined;

    resources['addMachineToDivision'] = $resource('[APIHOST]/division/:division_id/machine/:machine_id', {division_id:'@division_id',machine_id:'@machine_id'},
			     {
				 'addMachineToDivision': {method:'PUT', 'timeout': 15000}
			     })
    resources['enableMachineInDivision']=$resource('[APIHOST]/division_machine/:division_machine_id', {division_machine_id:'@division_machine_id'},
			     {
				 'enableMachineInDivision': {method:'PUT', 'timeout': 15000}
			     })
    resources['removeMachineFromDivision'] = $resource('[APIHOST]/division_machine/:division_machine_id', {division_machine_id:'@division_machine_id'},
			     {
				 'removeMachineFromDivision': {method:'DELETE', 'timeout': 15000}
			     })    
    resources['toggleTournamentActive'] = $resource('[APIHOST]/tournament/:tournament_id/:action', {tournament_id:'@tournament_id',action:'@action'},			     //killroy was here
			                            {
				                        'toggleTournamentActive': {method:'PUT','timeout': 15000}
			                            })
    resources['setMatchScore'] = $resource('[APIHOST]/finals/finals_score/:finalsScoreId/score/:score', null,     //killroy was here
					     {
						 'setMatchScore': {method:'POST', 'timeout': 15000}
					     })        
    resources['setMatchMachine'] = $resource('[APIHOST]/finals/divisionMachineId/:divisionMachineId/score/:finalsMatchId/game_num/:gameNumber', null,     //killroy was here
					     {
						 'setMatchMachine': {method:'POST', 'timeout': 15000}
					     })    
    resources['addTournament'] = $resource('[APIHOST]/tournament', null,     //killroy was here
					   {
					       'addTournament': {method:'POST', 'timeout': 15000}
					   })
    resources['addFinals'] = $resource('[APIHOST]/finals/division/:division_id', null,     //killroy was here
					   {
					       'addFinals': {method:'POST', 'timeout': 15000}
					   })
    resources['generateFinalsRounds'] = $resource('[APIHOST]/finals/:finals_id/generate_rounds', null,     //killroy was here
					   {
					       'generateFinalsRounds': {method:'POST', 'timeout': 15000}
					   })
    resources['fillFinalsRounds'] = $resource('[APIHOST]/finals/:finals_id/fill_rounds', null,     //killroy was here
					   {
					       'fillFinalsRounds': {method:'POST', 'timeout': 15000}
					   })            
    resources['addDivision'] = $resource('[APIHOST]/division', null, //killroy was here			     
					 {
					     'addDivision': {method:'POST', 'timeout': 15000}
					 })
    resources['getFinalsMatches'] = $resource('[APIHOST]/finals/:finals_id/match', null,
     					      {
     						  'getFinalsMatches': {method:'GET', 'timeout': 15000}
     					      })
    resources['getFinals'] = $resource('[APIHOST]/finals', null,
     				       {
     					   'getFinals': {method:'GET', 'timeout': 15000}
     				       })    
    resources['getDivisionsForFinals'] = $resource('[APIHOST]/division/ready_for_finals', null,
     					      {
     						  'getDivisionsForFinals': {method:'GET', 'timeout': 15000}
     					      })    
    resources['getFinalsMatch'] = $resource('[APIHOST]/finals/match/match_id/:match_id', null,
     					      {
     						  'getFinalsMatch': {method:'GET', 'timeout': 15000}
     					      })        
    resources['getActiveTournaments'] = $resource('[APIHOST]/tournament/active', null, //killroy
     						    {
     							'getActiveTournaments': {method:'GET', 'timeout': 15000}
     						    })    
    resources['getAllMetadivisions'] = $resource('[APIHOST]/metadivision', null, //killroy			     
						 {
						     'getAllMetadivisions': {method:'GET', 'timeout': 15000}
						 })
    resources['getAllTournaments'] = $resource('[APIHOST]/tournament', null,			     
						 {
						     'getAllTournaments': {method:'GET', 'timeout': 15000}
						 })
    resources['getAssholes'] = $resource('[APIHOST]/player/asshole', null,			     
						 {
						     'getAssholes': {method:'GET', 'timeout': 15000}
						 })    
    
    resources['addPlayer'] = $resource('[APIHOST]/player', null, //killroy			     
			     {
				 'addPlayer': {method:'POST', 'timeout': 15000}
			     })
    resources['getPlayer'] =  $resource('[APIHOST]/player/:player_id', null, //killroy was here			     
					{
					    'getPlayer': {method:'GET', 'timeout': 15000}
					})
    resources['getPlayerTokens']= $resource('[APIHOST]/token/player_id/:player_id', null, //killroy			     
					       {
						   'getPlayerTokens': {method:'GET', 'timeout': 15000}
					       })
    resources['getPlayerTeamTokens']= $resource('[APIHOST]/token/teams/:player_id', null, //killroy			     
					       {
						   'getPlayerTeamTokens': {method:'GET', 'timeout': 15000}
					       })    
    resources['getAllPlayers'] = $resource('[APIHOST]/player', null,			     
			     {
				 'getAllPlayers': {method:'GET', 'timeout': 15000}
			     })
    resources['getIfpaPlayer'] = $resource('[APIHOST]/ifpa/:player_name', null,			     
			     {
				 'getIfpaPlayer': {method:'GET', 'timeout': 15000}
			     })
    resources['getPlayerTeams'] = $resource('[APIHOST]/team/player/:player_id', null, //killroy			     
			     {
				 'getPlayerTeams': {method:'GET', 'timeout': 15000}
			     })    
    resources['addTeam'] = $resource('[APIHOST]/team', null,			     
			     {
				 'addTeam': {method:'POST', 'timeout': 15000}
			     })

    resources['getAllDivisions'] =  $resource('[APIHOST]/division', null, //killroy
			 {
			     'getAllDivisions': {method:'GET', 'timeout': 15000}
			 })
    resources['getActiveMachines'] =  $resource('[APIHOST]/machine/active', null,
			 {
			     'getActiveMachines': {method:'GET', 'timeout': 15000}
			 })
    resources['getAllMachinesArray'] = $resource('[APIHOST]/machine',null,
				       {
					'getAllMachinesArray': {method:'GET','timeout': 15000,
								isArray:true,
								transformResponse:machineDictToArray
							       }
                                       })    
    resources['getActiveMachinesArray'] = $resource('[APIHOST]/machine/active',null,
						    {
							'getActiveMachinesArray': {method:'GET','timeout': 15000,
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
    resources['getDivisionMachine'] =  $resource('[APIHOST]/divisionmachine/:division_machine_id', null,
			 {
			     'getDivisionMachine': {method:'GET', 'timeout': 15000}
			 })        
    resources['getAllPlayerEntries'] =  $resource('[APIHOST]/player/:player_id/entry/all', null,
			 {
			     'getAllPlayerEntries': {method:'GET', 'timeout': 15000}
			 })    
    resources['addTokens'] =  $resource('[APIHOST]/token', null, //killroy			     
					{
					    'addTokens': {method:'POST', 'timeout': 15000}
					})
    resources['changeScore'] =  $resource('[APIHOST]/score/:score_id', null,			     
					{
					    'changeScore': {method:'PUT', 'timeout': 15000}
					})	        
    resources['deleteScore'] =  $resource('[APIHOST]/score/:score_id', null,			     
					{
					    'deleteScore': {method:'DELETE', 'timeout': 15000}
					})
    resources['voidEntryToggle'] =  $resource('[APIHOST]/entry/:entry_id/void/:void_state',
					      {entry_id:'@entry_id', void_state:'@void_state'},
					      {
						  'voidEntryToggle': {method:'PUT', 'timeout': 15000}
					      })
    resources['voidEntry'] =  $resource('[APIHOST]/entry/:entry_id/void',
					      {entry_id:'@entry_id'},
					      {
						  'voidEntry': {method:'PUT', 'timeout': 15000}
					      })    
    resources['addMetadivision'] =  $resource('[APIHOST]/metadivision', null, //killroy			     
					  {
					      'addMetadivision': {method:'POST', 'timeout': 15000}
					  })
    resources['getRoles'] =  $resource('[APIHOST]/role', null,			     
					  {
					      'getRoles': {method:'GET', 'timeout': 15000}
					  })
    resources['addUser'] =  $resource('[APIHOST]/user', null,			     
					  {
					      'addUser': {method:'POST', 'timeout': 15000}
					  })
    resources['editPlayer'] =  $resource('[APIHOST]/player/:player_id', {player_id:'@player_id'}, //killroy			     
			     {
				 'editPlayer': {method:'PUT','timeout': 15000}
			     })
    resources['addScore'] =  $resource('[APIHOST]/entry/:entry_id/divisionmachine/:division_machine_id/new_score/:new_score',
				       {entry_id:'@entry_id',division_machine_id:'@division_machine_id',new_score_value:'@new_score_value'},			     
			     {
				 'addScore': {method:'POST','timeout': 15000}
			     })	    
    resources['getTournament'] = $resource('[APIHOST]/tournament/:tournament_id', null, //killroy was here
			     {
				 'getTournament': {method:'GET', 'timeout': 15000}
			     })
    resources['getPlayerActiveEntriesCount'] = $resource('[APIHOST]/player/:player_id/entry/active_count', null, //killroy
			     {
				 'getPlayerActiveEntriesCount': {method:'GET', 'timeout': 15000}
			     })
    resources['getPlayerActiveEntry'] = $resource('[APIHOST]/player/:player_id/division/:division_id/entry/active', null,
			     {
				 'getPlayerActiveEntry': {method:'GET', 'timeout': 15000}
			     })
    resources['getTeamActiveEntry'] = $resource('[APIHOST]/team/:team_id/division/:division_id/entry/active', null,
			     {
				 'getTeamActiveEntry': {method:'GET', 'timeout': 15000}
			     })        
    resources['getEntry'] = $resource('[APIHOST]/entry/:entry_id', null,
			     {
				 'getEntry': {method:'GET', 'timeout': 15000}
			     })        
    
    resources['getDivision'] = $resource('[APIHOST]/division/:division_id', null,
			     {
				 'getDivision': {method:'GET', 'timeout': 15000}
			     })
    resources['getTeam'] = $resource('[APIHOST]/team/:team_id', null,
			     {
				 'getTeam': {method:'GET', 'timeout': 15000}
			     })    
    resources['setDivisionMachinePlayer'] =  $resource('[APIHOST]/divisionmachine/:division_machine_id/player/:player_id', {division_machine_id:'@division_machine_id',player_id:'@player_id'},  
			     {
				 'setDivisionMachinePlayer': {method:'PUT','timeout': 15000}
			     })
    resources['setDivisionMachineTeam'] =  $resource('[APIHOST]/divisionmachine/:division_machine_id/team/:team_id', {division_machine_id:'@division_machine_id',player_id:'@team_id'},  
			     {
				 'setDivisionMachineTeam': {method:'PUT','timeout': 15000}
			     })    
    resources['clearDivisionMachinePlayer'] =  $resource('[APIHOST]/divisionmachine/:division_machine_id/player/:player_id/clear', {division_machine_id:'@division_machine_id',player_id:'@player_id'},  
			     {
				 'clearDivisionMachinePlayer': {method:'PUT','timeout': 15000}
			     })
    resources['playerIsAsshole'] =  $resource('[APIHOST]/divisionmachine/:division_machine_id/player/:player_id/entry/:entry_id/asshole', {division_machine_id:'@division_machine_id',player_id:'@player_id',entry_id:'@entry_id'},  
			     {
				 'playerIsAsshole': {method:'PUT','timeout': 15000}
			     })    
    resources['completeEntry'] =  $resource('[APIHOST]/entry/:entry_id/complete', {entry_id:'@entry_id'},  
			     {
				 'completeEntry': {method:'PUT','timeout': 15000}
			     })	
    
    
    
    return {
	GetAllResources: function(){//killroy was here
	    return resource_results;
	},
	GetPlayerNameSmushed: function(){
	    return resource_results.player.first_name+resource_results.player.last_name;
	},
	GetEntryId: function(){
	    return resource_results.player_active_entry.entry.entry_id
	},
	GetTeamEntryId: function(){
	    return resource_results.team_active_entry.entry.entry_id
	},		
	GetTournamentIdFromDivision: function(){
	    return resource_results.division.tournament_id
	},
	GetPlayerIdFromDivisionMachine: function(){
	    return resource_results.division_machine.player_id;
	},	
	GetPlayerLinkedTournamentId: function(){
	    return resource_results.player.linked_division.tournament_id;
	    //return 1;
	},
	AddFinals: generic_resource('addFinals','added_finals','post', false),	//killroy was here
	AddMetadivision: generic_resource('addMetadivision','meta_division','post', false), //killroy
	AddMachineToDivision: generic_resource('addMachineToDivision','added_machine','post',false), //killroy
	AddPlayer: generic_resource('addPlayer','added_player','post',false), //killroy       
        AddTeam: generic_resource('addTeam','team','post',false),
	AddTokens: generic_resource('addTokens','add_tokens_result','post', false),//killroy
	AddTournament: generic_resource('addTournament','add_tournament_result','post', false),	//killroy was here	
	AddDivision: generic_resource('addDivision','add_division_result','post', false),	//killroy was here	
	AddUser: generic_resource('addUser','user','post', false),
	AddScore: generic_resource('addScore','entry','post',false),
	ChangeScore: generic_resource('changeScore','score','post', false),
        ClearDivisionMachinePlayer: generic_resource('clearDivisionMachinePlayer','empty','post', false),
	CompleteEntry: generic_resource('completeEntry','entry','post', false),
	DeleteScore: generic_resource('deleteScore','score','get', false),
        EditPlayer: generic_resource('editPlayer','edited_player','post', false),//killroy
	EnableMachineInDivision: generic_resource('enableMachineInDivision','edited_player','post', false),//killroy
        FillFinalsRounds: generic_resource('fillFinalsRounds','fill_finals_rounds_result','post', false),//killroy was here		
	GenerateFinalsRounds: generic_resource('generateFinalsRounds','generate_finals_rounds_result','post', false),	//killroy was here	
        GetActiveMachines: generic_resource('getActiveMachines','machines','get',false),
	GetActiveMachinesArray: generic_resource('getActiveMachinesArray','machines_array','get',false),        
	GetActiveTournaments: generic_resource('getActiveTournaments','tournaments','get',false), //killroy
	GetAllDivisions: generic_resource('getAllDivisions','divisions','get', false),//killroy
	GetAllMachinesArray: generic_resource('getAllMachinesArray','machines','get',false), //killroy
	GetAllMetadivisions: generic_resource('getAllMetadivisions','metadivisions','get',false), //killroy	
        GetAllPlayers: generic_resource('getAllPlayers','players','get',false),        
	GetAllPlayerEntries: generic_resource('getAllPlayerEntries','player_entries','get',false),
	GetAllTournaments: generic_resource('getAllTournaments','tournaments','get',false),//killroy was here
	GetAssholes: generic_resource('getAssholes','assholes','get',false),        
	GetDivision: generic_resource('getDivision','division','get',false), //killroy
	GetDivisionsForFinals: generic_resource('getDivisionsForFinals','divisions_ready_for_finals','get', false),
	GetDivisionMachine: generic_resource('getDivisionMachine','division_machine','get',false),
	GetEntry: generic_resource('getEntry','entry','get',false),		
	GetFinals: generic_resource('getFinals','finals','get', false),
	GetFinalsMatches: generic_resource('getFinalsMatches','finals_matches','get', false),
	GetFinalsMatch: generic_resource('getFinalsMatch','finals_match','get', false),	
	GetIfpaPlayer: generic_resource('getIfpaPlayer','ifpa_player','get',false), //killroy
	GetPlayer: generic_resource('getPlayer','player','get', false),//killroy
	GetPlayerActiveEntriesCount: generic_resource('getPlayerActiveEntriesCount','player_active_entries_count','get', false), //killroy
	GetPlayerActiveEntry: generic_resource('getPlayerActiveEntry','player_active_entry','get', false),	
	GetPlayerTeams: generic_resource('getPlayerTeams','player_teams','get', false), //killroy
	GetPlayerTokens: generic_resource('getPlayerTokens','player_tokens','get', false),//killroy
	GetPlayerTeamTokens: generic_resource('getPlayerTeamTokens','player_team_tokens','get',false),
	GetRoles: generic_resource('getRoles','roles','get', false),
	GetTeam: generic_resource('getTeam','team','get', false),
	GetTeamActiveEntry: generic_resource('getTeamActiveEntry','team_active_entry','get', false),	
	GetTournament: generic_resource('getTournament','tournament','get',false), //killroy was here
	PlayerIsAsshole: generic_resource('playerIsAsshole','empty','post', false),
        RemoveMachineFromDivision: generic_resource('removeMachineFromDivision','empty','get', false),//enable
	SetDivisionMachinePlayer: generic_resource('setDivisionMachinePlayer','division_machine','post', false),
	SetDivisionMachineTeam: generic_resource('setDivisionMachineTeam','division_machine','post', false),
	SetMatchMachine: generic_resource('setMatchMachine','match_machine','post', false),
	SetMatchScore: generic_resource('setMatchScore','match_score','post', false),
        ToggleTournamentActive: generic_resource('toggleTournamentActive','toggled_tournament','post', false), //killroy was here
	VoidEntryToggle: generic_resource('voidEntryToggle','entry','post', false),
	VoidEntry: generic_resource('voidEntry','entry','post', false),
	
	FlushResourceCache:flush_resource_cache,
	getAllMetadivisionsResource: function(){
	    return $resource('[APIHOST]/metadivision', null,			     
			     {
				 'getAllMetadivisions': {method:'GET', 'timeout': 15000}
			     })	    
	},	
	loginResource: function (){
	    return $resource('[APIHOST]/login', null,
			     {
				 'login': { method:'PUT' , 'timeout': 15000}
			     });
	},
	// addTournamentResource: function(){
	//     return $resource('[APIHOST]/tournament', null,
	// 		     {
	// 			 'addTournament': {method:'POST', 'timeout': 15000}
	// 		     })
	// },
	getAllTournamentsResource: function(){
	    return $resource('[APIHOST]/tournament', null,
			     {
				 'getAllTournaments': {method:'GET', 'timeout': 15000}
			     })
	},
	getActiveTournamentsResource: function(){
	    return $resource('[APIHOST]/tournament/active', null,
			     {
				 'getActiveTournaments': {method:'GET', 'timeout': 15000}
			     })
	},
	getTournamentResource: function(){
	    return $resource('[APIHOST]/tournament/:tournament_id', null,
			     {
				 'getTournament': {method:'GET', 'timeout': 15000}
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
				 'addDivision': {method:'POST', 'timeout': 15000}
			     })
	},
	getDivisionResource: function(){
	    return $resource('[APIHOST]/division/:division_id', null,
			     {
				 'getDivision': {method:'GET', 'timeout': 15000}
			     })
	},
	getAllDivisionsResource: function(){
	    return $resource('[APIHOST]/division', null,
			     {
				 'getAllDivisions': {method:'GET', 'timeout': 15000}
			     })
	},
	getAllMachinesResource: function(){
	    return $resource('[APIHOST]/machine', null,
			     {
				 'getAllMachines': {method:'GET', 'timeout': 15000}
			     })
	},
	getAllMachinesArrayResource: function(){
	    return $resource('[APIHOST]/machine', null,
			     {
				 'getAllMachinesArray': {
				     method:'GET',
				     'timeout': 15000,
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
				 'addMachineToDivision': {method:'PUT', 'timeout': 15000}
			     })
	},
	removeMachineFromDivisionResource: function(){
	    return $resource('[APIHOST]/division_machine/:division_machine_id', {division_machine_id:'@division_machine_id'},
			     {
				 'removeMachineFromDivision': {method:'DELETE', 'timeout': 15000}
			     })
	},
	enableMachineInDivisionResource: function(){
	    return $resource('[APIHOST]/division_machine/:division_machine_id', {division_machine_id:'@division_machine_id'},
			     {
				 'enableMachineInDivision': {method:'PUT', 'timeout': 15000}
			     })
	},
	addPlayerResource: function(){
	    return $resource('[APIHOST]/player', null,			     
			     {
				 'addPlayer': {method:'POST', 'timeout': 15000}
			     })
	},
	getPlayerResource: function(){
	    return $resource('[APIHOST]/player/:player_id', null,			     
			     {
				 'getPlayer': {method:'GET', 'timeout': 15000}
			     })
	},
	editPlayerResource: function(){
	    return $resource('[APIHOST]/player/:player_id', {player_id:'@player_id'},			     
			     {
				 'editPlayer': {method:'PUT','timeout': 15000}
			     })
	},
	toggleTournamentActiveResource: function(){
	    return $resource('[APIHOST]/tournament/:tournament_id/:action', {tournament_id:'@tournament_id',action:'@action'},			     
			     {
				 'toggleTournamentActive': {method:'PUT','timeout': 15000}
			     })
	},
	getTokensForPlayerResource: function(){
	    return $resource('[APIHOST]/token/player_id/:player_id', null,			     
			     {
				 'getTokensForPlayer': {method:'GET', 'timeout': 15000}
			     })	    
	},
	addTokensResource: function(){
	    return $resource('[APIHOST]/token', null,			     
			     {
				 'addTokens': {method:'POST', 'timeout': 15000}
			     })	    
	}
    };
});
