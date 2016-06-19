angular.module('tom_services.timeout_resources', ['ngResource']);
angular.module('tom_services.timeout_resources').factory('TimeoutResources', function($resource,$q) {
    var resource_results = {};
    var resources = {};    
    var timestamps = {};

    var flush_resource_cache = function(){
        resource_results = {};
    };
    
    var resolved_promise = function(){
	var defer = $q.defer()
	defer.resolve();
	return defer.promise;
    }


    var generic_getdelete_resource = function(res,scope_name,args){
	if(args == undefined){
	    args={}
	}
            res=res['custom_http'];                
        resource_results[scope_name] = res(args);
	return resource_results[scope_name].$promise;	
    }
    var generic_putpost_resource = function(res,scope_name,url_args,post_args){
	if(url_args == undefined){
	    url_args={}
	}
	if(post_args == undefined){
	    post_args={}
	}
        res=res['custom_http'];                
        resource_results[scope_name] = res(url_args, post_args);
	return resource_results[scope_name].$promise;	
    }
    

    generate_resource_definition = function(url,http_method){
        console.log('generating');
        url_chunks = url.split("/");
        gen_post_args = {}
        for(url_chunk_index in url_chunks){
            url_chunk = url_chunks[url_chunk_index];
            if(url_chunk.indexOf(':')>=0){
                arg_name = url_chunk.substr(1)
                gen_post_args[arg_name]='@'+arg_name;
            };
        }
        return $resource('[APIHOST]/'+url,gen_post_args,
                         {                             
                             'custom_http':{method:http_method, timeout:15000}
                         }
                        );
    };


    var generic_resource = function(res,scope_name,type,cache_resource){        
	return function(promise,url_args,post_args,runtime_cache_override){
	    if(promise == undefined){
                promise = resolved_promise();
	    }	    
	    return promise.then(function(data){
		if(type == "get"){
	     	    return generic_getdelete_resource(res,scope_name,url_args);
		} else {
	     	    return generic_putpost_resource(res,scope_name,url_args,post_args);
		}
	    })
	}
    }

    addDivisionResource = generate_resource_definition('/division',
                                                       'POST');
    addFinalsResource = generate_resource_definition('/finals/division/:division_id',
                                                     'POST');
    // addMachineToDivisionResource = generate_resource_definition('/division/:division_id/machine/:machine_id',
    //                                                             'PUT');
    addMachineToDivisionResource = generate_resource_definition('/division_machine/division/:division_id/machine/:machine_id',
                                                                'POST');    
    addMetadivisionResource = generate_resource_definition('/metadivision',
                                                           'POST');
    addPlayerResource = generate_resource_definition('/player',
                                                     'POST');
    addScoreResource = generate_resource_definition('/entry/:entry_id/divisionmachine/:division_machine_id/new_score/:new_score',
                                                    'POST');
    addTeamResource = generate_resource_definition('/team',
                                                   'POST');
    addTokensResource = generate_resource_definition('/token',
                                                     'POST');
    addTournamentResource = generate_resource_definition('/tournament',
                                                         'POST');
    addUserResource = generate_resource_definition('/user',
                                                   'POST');
    changeScoreResource = generate_resource_definition('/score/:score_id',
                                                       'PUT');
    clearDivisionMachinePlayerResource = generate_resource_definition('/divisionmachine/:division_machine_id/player/:player_id/clear',
                                                                      'PUT');
    clearDivisionMachineTeamResource = generate_resource_definition('/divisionmachine/:division_machine_id/team/:team_id/clear',
                                                                    'PUT');
    completeEntryResource = generate_resource_definition('/entry/:entry_id/complete',
                                                         'PUT');
    completeEntryToggleResource = generate_resource_definition('/entry/:entry_id/complete/:complete_state',
                                                               'PUT');
    deleteScoreResource = generate_resource_definition('/score/:score_id',
                                                       'DELETE');
    editPlayerResource = generate_resource_definition('/player/:player_id',
                                                      'PUT');
    enableMachineInDivisionResource = generate_resource_definition('/division_machine/:division_machine_id',
                                                                   'PUT');
    fillFinalsRoundsResource = generate_resource_definition('/finals/:finals_id/fill_rounds',
                                                            'POST');
    generateFinalsRoundsResource = generate_resource_definition('/finals/:finals_id/generate_rounds',
                                                                'POST');
    getActiveMachinesResource = generate_resource_definition('/machine/active',
                                                             'GET');
    getActiveTournamentsResource = generate_resource_definition('/tournament/active',
                                                                'GET');
    getAllDivisionsResource = generate_resource_definition('/division',
                                                           'GET');
    getAllEntriesResource = generate_resource_definition('/entry/count/:count',
                                                         'GET');
    getAllMetadivisionsResource = generate_resource_definition('/metadivision',
                                                               'GET');
    getAllMachinesResource = generate_resource_definition('/machine',
                                                               'GET');    
    getAllPlayerEntriesResource = generate_resource_definition('/player/:player_id/entry/all',
                                                               'GET');
    getAllPlayersResource = generate_resource_definition('/player',
                                                         'GET');
    getAllTournamentsResource = generate_resource_definition('/tournament',
                                                             'GET');
    getAssholesResource = generate_resource_definition('/player/asshole',
                                                       'GET');
    getDivTicketCostFromStripeResource = generate_resource_definition('/sale/sku',
                                                                      'GET');
    getDivisionResource = generate_resource_definition('/division/:division_id',
                                                       'GET');
    getDivisionMachineResource = generate_resource_definition('/divisionmachine/:division_machine_id',
                                                              'GET');
    getDivisionsForFinalsResource = generate_resource_definition('/division/ready_for_finals',
                                                                 'GET');
    getEntryResource = generate_resource_definition('/entry/:entry_id',
                                                    'GET');
    getFinalsResource = generate_resource_definition('/finals',
                                                     'GET');
    getFinalsMatchResource = generate_resource_definition('/finals/match/match_id/:match_id',
                                                          'GET');
    getFinalsMatchesResource = generate_resource_definition('/finals/:finals_id/match',
                                                            'GET');
    getIfpaPlayerResource = generate_resource_definition('/ifpa/:player_name',
                                                         'GET');
    getPlayerResource = generate_resource_definition('/player/:player_id',
                                                     'GET');
    getPlayerActiveEntriesCountResource = generate_resource_definition('/player/:player_id/entry/active_count',
                                                                       'GET');
    getPlayerActiveEntryResource = generate_resource_definition('/player/:player_id/division/:division_id/entry/active',
                                                                'GET');
    getPlayerTeamTokensResource = generate_resource_definition('/token/teams/:player_id',
                                                               'GET');
    getPlayerTeamsResource = generate_resource_definition('/team/player/:player_id',
                                                          'GET');
    getPlayerTokensResource = generate_resource_definition('/token/player_id/:player_id',
                                                           'GET');
    getRolesResource = generate_resource_definition('/role',
                                                    'GET');
    getTeamResource = generate_resource_definition('/team/:team_id',
                                                   'GET');
    getTeamActiveEntryResource = generate_resource_definition('/team/:team_id/division/:division_id/entry/active',
                                                              'GET');
    getTomConfigResource = generate_resource_definition('/config/tom',
                                                         'GET');    
    getTournamentResource = generate_resource_definition('/tournament/:tournament_id',
                                                         'GET');
    loginResource = generate_resource_definition('/login',
                                                 'PUT');
    loginPlayerResource = generate_resource_definition('/login/player/pin/:player_pin',
                                                       'PUT');
    playerIsAssholeResource = generate_resource_definition('/divisionmachine/:division_machine_id/entry/:entry_id/asshole',
                                                           'PUT');
    removeMachineFromDivisionResource = generate_resource_definition('/division_machine/:division_machine_id',
                                                                     'DELETE');
    setDivisionMachinePlayerResource = generate_resource_definition('/divisionmachine/:division_machine_id/player/:player_id',
                                                                    'PUT');
    setDivisionMachineTeamResource = generate_resource_definition('/divisionmachine/:division_machine_id/team/:team_id',
                                                                  'PUT');
    setMatchMachineResource = generate_resource_definition('/finals/divisionMachineId/:divisionMachineId/score/:finalsMatchId/game_num/:gameNumber',
                                                           'POST');
    setMatchScoreResource = generate_resource_definition('/finals/finals_score/:finalsScoreId/score/:score',
                                                         'POST');
    toggleTournamentActiveResource = generate_resource_definition('/tournament/:tournament_id/:action',                                                              
                                                                  'PUT');        
    voidEntryResource = generate_resource_definition('/entry/:entry_id/void',
                                                     'PUT');
    voidEntryToggleResource = generate_resource_definition('/entry/:entry_id/void/:void_state',
                                                           'PUT');
    
    return {
	GetAllResources: function(){//killroy was here
	    return resource_results;
	},

	AddFinals: generic_resource(addFinalsResource,'added_finals','post', false),	//killroy was here
	AddMetadivision: generic_resource(addMetadivisionResource,'meta_division','post', false), //killroy
	AddMachineToDivision: generic_resource(addMachineToDivisionResource,'added_machine','post',false), //killroy
	AddPlayer: generic_resource(addPlayerResource,'added_player','post',false), //killroy
        AddTeam: generic_resource(addTeamResource,'team','post',false), //killroy
	AddTokens: generic_resource(addTokensResource,'add_tokens_result','post', false),//killroy
	AddTournament: generic_resource(addTournamentResource,'add_tournament_result','post', false),	//killroy was here
	AddDivision: generic_resource(addDivisionResource,'add_division_result','post', false),	//killroy was here
	AddUser: generic_resource(addUserResource,'user','post', false),
	AddScore: generic_resource(addScoreResource,'entry','post',false), //killroy
	ChangeScore: generic_resource(changeScoreResource,'score','post', false), //killroy
        ClearDivisionMachinePlayer: generic_resource(clearDivisionMachinePlayerResource,'empty','post', false), //killroy
        ClearDivisionMachineTeam: generic_resource(clearDivisionMachineTeamResource,'empty','post', false), //killroy
	CompleteEntry: generic_resource(completeEntryResource,'entry','post', false),
	CompleteEntryToggle: generic_resource(completeEntryToggleResource,'entry','post', false),
	DeleteScore: generic_resource(deleteScoreResource,'score','get', false), //killroy
        EditPlayer: generic_resource(editPlayerResource,'edited_player','post', false),//killroy
	EnableMachineInDivision: generic_resource(enableMachineInDivisionResource,'edited_player','post', false),//killroy
        FillFinalsRounds: generic_resource(fillFinalsRoundsResource,'fill_finals_rounds_result','post', false),//killroy was here
	GenerateFinalsRounds: generic_resource(generateFinalsRoundsResource,'generate_finals_rounds_result','post', false),	//killroy was here
        GetActiveMachines: generic_resource(getActiveMachinesResource,'machines','get',false), //killroy
	GetActiveTournaments: generic_resource(getActiveTournamentsResource,'tournaments','get',false), //killroy
	GetAllDivisions: generic_resource(getAllDivisionsResource,'divisions','get', false),//killroy
        GetAllEntries: generic_resource(getAllEntriesResource,'all_entries','get', false),
        GetAllMachines: generic_resource(getAllMachinesResource,'machines','get', false),
	GetAllMetadivisions: generic_resource(getAllMetadivisionsResource,'metadivisions','get',false), //killroy
        GetAllPlayers: generic_resource(getAllPlayersResource,'players','get',false),
	GetAllPlayerEntries: generic_resource(getAllPlayerEntriesResource,'player_entries','get',false),
	GetAllTournaments: generic_resource(getAllTournamentsResource,'tournaments','get',false),//killroy was here
	GetAssholes: generic_resource(getAssholesResource,'assholes','get',false),
	GetDivision: generic_resource(getDivisionResource,'division','get',false), //killroy
        GetDivTicketCostFromStripe: generic_resource(getDivTicketCostFromStripeResource,'divisions_costs','get', false),
	GetDivisionsForFinals: generic_resource(getDivisionsForFinalsResource,'divisions_ready_for_finals','get', false),
	GetDivisionMachine: generic_resource(getDivisionMachineResource,'division_machine','get',false), //killroy
	GetEntry: generic_resource(getEntryResource,'entry','get',false),
	GetFinals: generic_resource(getFinalsResource,'finals','get', false),
	GetFinalsMatches: generic_resource(getFinalsMatchesResource,'finals_matches','get', false),
	GetFinalsMatch: generic_resource(getFinalsMatchResource,'finals_match','get', false),
	GetIfpaPlayer: generic_resource(getIfpaPlayerResource,'ifpa_player','get',false), //killroy
	GetPlayer: generic_resource(getPlayerResource,'player','get', false),//killroy
	GetPlayerActiveEntriesCount: generic_resource(getPlayerActiveEntriesCountResource,'player_active_entries_count','get', false), //killroy
	GetPlayerActiveEntry: generic_resource(getPlayerActiveEntryResource,'active_entry','get', false),
	GetPlayerTeams: generic_resource(getPlayerTeamsResource,'player_teams','get', false), //killroy
	GetPlayerTokens: generic_resource(getPlayerTokensResource,'player_tokens','get', false),//killroy
	GetPlayerTeamTokens: generic_resource(getPlayerTeamTokensResource,'player_team_tokens','get',false),
	GetRoles: generic_resource(getRolesResource,'roles','get', false),
	GetTeam: generic_resource(getTeamResource,'team','get', false),
        GetTomConfig: generic_resource(getTomConfigResource,'tom_config','get', false),
	GetTeamActiveEntry: generic_resource(getTeamActiveEntryResource,'active_entry','get', false),
	GetTournament: generic_resource(getTournamentResource,'tournament','get',false), //killroy was here
	PlayerIsAsshole: generic_resource(playerIsAssholeResource,'empty','post', false), //killroy
        RemoveMachineFromDivision: generic_resource(removeMachineFromDivisionResource,'empty','get', false),//enable
	SetDivisionMachinePlayer: generic_resource(setDivisionMachinePlayerResource,'division_machine','post', false), //killroy
	SetDivisionMachineTeam: generic_resource(setDivisionMachineTeamResource,'division_machine','post', false), //killroy
	SetMatchMachine: generic_resource(setMatchMachineResource,'match_machine','post', false),
	SetMatchScore: generic_resource(setMatchScoreResource,'match_score','post', false),
        ToggleTournamentActive: generic_resource(toggleTournamentActiveResource,'toggled_tournament','post', false), //killroy was here
	VoidEntryToggle: generic_resource(voidEntryToggleResource,'entry','post', false), //killroy
	VoidEntry: generic_resource(voidEntryResource,'entry','post', false),
	Login: generic_resource(loginResource,'logged_in_user','post', false),
	LoginPlayer: generic_resource(loginPlayerResource,'logged_in_player','post', false),
	FlushResourceCache:flush_resource_cache
    };
});
