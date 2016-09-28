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

    var rejected_promise = function(){
	var defer = $q.defer()
	defer.reject();
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
    
    global_timeout = 15000;
    
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
                             'custom_http':{method:http_method, timeout:global_timeout}
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
    addFinalsResource = generate_resource_definition('/finals_ex/division/:division_id/num_players/:num_players/num_players_per_group/:num_players_per_group/num_games_per_match/:num_games_per_match/description/:description',
                                                     'POST');
    // addMachineToDivisionResource = generate_resource_definition('/division/:division_id/machine/:machine_id',
    //                                                             'PUT');
    addMachineToDivisionResource = generate_resource_definition('/division_machine/division/:division_id/machine/:machine_id',
                                                                'POST');    
    addMetadivisionResource = generate_resource_definition('/metadivision',
                                                           'POST');
    addPlayerResource = generate_resource_definition('/player',
                                                     'POST');
    addPlayerQueueResource = generate_resource_definition('/queue/player_id/:player_id/division_machine_id/:division_machine_id',
                                                            'POST');

    addScoreResource = generate_resource_definition('/entry_newscore/divisionmachine/:division_machine_id/new_score/:new_score',
                                                    'POST');
    addTeamResource = generate_resource_definition('/team',
                                                   'POST');
    addTokensResource = generate_resource_definition('/token/paid_for/1',
                                                     'POST');
    addConditionalTokensResource = generate_resource_definition('/token/paid_for/0',
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
    confirmTokensPurchaseResource = generate_resource_definition('/token/confirm_paid_for',
                                                     'PUT');        
    completeEntryResource = generate_resource_definition('/entry/:entry_id/complete',
                                                         'PUT');
    completeFinalsRoundResource = generate_resource_definition('/finals_ex/rounds/fill/finals_ex/:finals_ex_id/round/:round_number',
                                                         'PUT');    
    completeEntryToggleResource = generate_resource_definition('/entry/:entry_id/complete/:complete_state',
                                                               'PUT');
    deleteScoreResource = generate_resource_definition('/score/:score_id',
                                                       'DELETE');
    editPlayerResource = generate_resource_definition('/player/:player_id',
                                                      'PUT');
    enableMachineInDivisionResource = generate_resource_definition('/division_machine/:division_machine_id',
                                                                   'PUT');
    fillFinalsRoundsResource = generate_resource_definition('/finals_ex/rounds/fill_init/finals_ex/:finals_ex_id',
                                                            'POST');
    generateFinalsRoundsResource = generate_resource_definition('/finals_ex/rounds/generate/finals_ex/:finals_id',
                                                                'POST');
    getActiveMachinesResource = generate_resource_definition('/machine/active',
                                                             'GET');
    getActiveTournamentsResource = generate_resource_definition('/tournament/active',
                                                                'GET');
    getAllDivisionsResource = generate_resource_definition('/division',
                                                           'GET');
    getAllDivisionMachinesResource = generate_resource_definition('/division_machine',
                                                           'GET');    
    getActiveDivisionsResource = generate_resource_definition('/division/active',
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
    getDivisionResource = generate_resource_definition('/division/division_id/:division_id',
                                                       'GET');
    getDivisionMachineResource = generate_resource_definition('/divisionmachine/:division_machine_id',
                                                              'GET');
    getDivisionsForFinalsResource = generate_resource_definition('/division/ready_for_finals',
                                                                 'GET');
    getDivisionQueueResource = generate_resource_definition('/queue/division/:division_id',
                                                            'GET');
    getPlayerQueueResource = generate_resource_definition('/queue/player_id/:player_id',
                                                            'GET');
    
    getEntryResource = generate_resource_definition('/entry/:entry_id',
                                                    'GET');
    getHerbBestScoresResource = generate_resource_definition('/herb_best_scores/division_id/:division_id/player_id/:player_id',
                                                    'GET');    
    getAllFinalsResource = generate_resource_definition('/finals_ex',
                                                        'GET');
    getFinalsResource = generate_resource_definition('/finals_ex/:finals_ex_id',
                                                     'GET');    
    getFinalsMatchResource = generate_resource_definition('finals_match_ex/finals_match_ex_id/:finals_match_ex_id',
                                                          'GET');
    getFinalsMatchesResource = generate_resource_definition('finals_ex/:finals_ex_id/match',
                                                            'GET');
    getFinalsMatchSlotsResource = generate_resource_definition('finals_match_slot_ex/finals_match_ex_id/:finals_match_ex_id',
                                                            'GET');
    
    getIfpaPlayerResource = generate_resource_definition('/ifpa/:player_name',
                                                         'GET');
    getPlayerResource = generate_resource_definition('/player/:player_id',
                                                     'GET');
    getPlayerActiveEntriesCountResource = generate_resource_definition('/player/:player_id/entry/active_count',
                                                                       'GET');
    getPlayerActiveEntryResource = generate_resource_definition('/player/:player_id/division/:division_id/entry/active',
                                                                'GET');
    getPlayerPinResource = generate_resource_definition('/player/pin/:player_id',
                                                               'GET');

    getPlayerTeamTokensResource = generate_resource_definition('/token/teams/:player_id',
                                                               'GET');
    getPlayerTeamsResource = generate_resource_definition('/team/player/:player_id',
                                                          'GET');
    getPlayerTokensResource = generate_resource_definition('/token/player_id/:player_id',
                                                           'GET');
    global_timeout=150000;
    getPlayersRankedByQualifyingResource = generate_resource_definition('/division/:division_id/players/ranked',
                                                                        'GET');
    global_timeout=15000;
    getPlayersRankedByQualifyingHerbResource = generate_resource_definition('/division/:division_id/herb/players/ranked',
                                                           'GET');        
    getSkuResource = generate_resource_definition('/sale/sku/:sku',
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
    resolveTieBreakerResource = generate_resource_definition('/finals_match_tiebreaker/finals_match_ex_id/:finals_match_ex_id',
                                                                    'PUT');    
    removePlayerQueueResource = generate_resource_definition('/queue/player_id/:player_id',
                                                            'DELETE');

    setDivisionMachinePlayerResource = generate_resource_definition('/divisionmachine/:division_machine_id/player/:player_id',
                                                                    'PUT');
    setDivisionMachineTeamResource = generate_resource_definition('/divisionmachine/:division_machine_id/team/:team_id',
                                                                  'PUT');
    setFinalsMatchResource = generate_resource_definition('/finals_match_ex/finals_match_ex_id/:finals_match_ex_id',
                                                          'PUT');
    setFinalsMatchInProgressResource = generate_resource_definition('/finals_match_ex/in_progress/finals_match_ex_id/:finals_match_ex_id',
                                                           'PUT');    
    setFinalsMatchResultResource = generate_resource_definition('/finals_match_result_ex/finals_match_result_ex_id/:finals_match_result_ex_id',
                                                                'PUT');
    setFinalsMatchResultMachineResource = generate_resource_definition('finals_match_result_ex/machine/finals_match_result_ex_id/:finals_match_result_ex_id/machine_id/:machine_id',
                                                           'PUT');    
    setFinalsMatchScoreResource = generate_resource_definition('/finals_match_result_score_ex/finals_match_result_score_ex_id/:finals_match_result_score_ex_id',
                                                               'PUT');
    setFinalsMatchSlotsResource = generate_resource_definition('/finals_match_slot_ex',
                                                         'PUT');    
    swipeTicketsResource = generate_resource_definition('/sale',
                                                         'POST');    
    toggleTournamentActiveResource = generate_resource_definition('/tournament/:tournament_id/:action',                                                              
                                                                  'PUT');
    updateDivisionMachineResource = generate_resource_definition('/divisionmachine_edit/:division_machine_id',                                                              
                                                                 'PUT');
    updateDivisionResource = generate_resource_definition('/division/:division_id',                                                              
                                                                  'PUT');    
    
    // voidEntryResource = generate_resource_definition('/entry/:entry_id/void',
    //                                                  'PUT');
    voidEntryResource = generate_resource_definition('/entry/:entry_id/void',
                                                      'PUT');
    voidEntryBeforeCreateResource = generate_resource_definition('/void/division_machine_id/:division_machine_id',
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
	AddPlayerQueue: generic_resource(addPlayerQueueResource,'empty','post',false), //killroy        
        AddTeam: generic_resource(addTeamResource,'team','post',false), //killroy
	AddTokens: generic_resource(addTokensResource,'add_tokens_result','post', false),//killroy
	AddConditionalTokens: generic_resource(addConditionalTokensResource,'add_tokens_result','post', false),//killroy
	AddTournament: generic_resource(addTournamentResource,'add_tournament_result','post', false),	//killroy was here
	AddDivision: generic_resource(addDivisionResource,'add_division_result','post', false),	//killroy was here
	AddUser: generic_resource(addUserResource,'user','post', false),
	AddScore: generic_resource(addScoreResource,'entry','post',false), //killroy
	ChangeScore: generic_resource(changeScoreResource,'score','post', false), //killroy
        ClearDivisionMachinePlayer: generic_resource(clearDivisionMachinePlayerResource,'empty','post', false), //killroy
        ClearDivisionMachineTeam: generic_resource(clearDivisionMachineTeamResource,'empty','post', false), //killroy
        ConfirmTokensPurchase: generic_resource(confirmTokensPurchaseResource,'empty','post', false), //killroy
        CompleteEntry: generic_resource(completeEntryResource,'entry','post', false),
	CompleteEntryToggle: generic_resource(completeEntryToggleResource,'entry','post', false),
        CompleteFinalsRound: generic_resource(completeFinalsRoundResource,'empty','post', false),
	DeleteScore: generic_resource(deleteScoreResource,'score','get', false), //killroy
        EditPlayer: generic_resource(editPlayerResource,'edited_player','post', false),//killroy
	EnableMachineInDivision: generic_resource(enableMachineInDivisionResource,'edited_player','post', false),//killroy
        FillFinalsRounds: generic_resource(fillFinalsRoundsResource,'fill_finals_rounds_result','post', false),//killroy was here
	GenerateFinalsRounds: generic_resource(generateFinalsRoundsResource,'generate_finals_rounds_result','post', false),	//killroy was here
        GetActiveMachines: generic_resource(getActiveMachinesResource,'machines','get',false), //killroy
	GetActiveTournaments: generic_resource(getActiveTournamentsResource,'tournaments','get',false), //killroy
	GetAllDivisions: generic_resource(getAllDivisionsResource,'divisions','get', false),//killroy
        GetAllDivisionMachines: generic_resource(getAllDivisionMachinesResource,'division_machines','get', false),//killroy
        GetAllEntries: generic_resource(getAllEntriesResource,'all_entries','get', false),
        GetAllMachines: generic_resource(getAllMachinesResource,'machines','get', false),
	GetAllMetadivisions: generic_resource(getAllMetadivisionsResource,'metadivisions','get',false), //killroy
        GetAllPlayers: generic_resource(getAllPlayersResource,'players','get',false),
	GetAllPlayerEntries: generic_resource(getAllPlayerEntriesResource,'player_entries','get',false),
	GetAllTournaments: generic_resource(getAllTournamentsResource,'tournaments','get',false),//killroy was here
	GetAssholes: generic_resource(getAssholesResource,'assholes','get',false),
	GetDivision: generic_resource(getDivisionResource,'division','get',false), //killroy
	GetActiveDivisions: generic_resource(getActiveDivisionsResource,'active_divisions','get',false), //killroy
        
        GetDivTicketCostFromStripe: generic_resource(getDivTicketCostFromStripeResource,'divisions_costs','get', false),
	GetDivisionsForFinals: generic_resource(getDivisionsForFinalsResource,'divisions_ready_for_finals','get', false),
	GetDivisionMachine: generic_resource(getDivisionMachineResource,'division_machine','get',false), //killroy
	GetDivisionQueue: generic_resource(getDivisionQueueResource,'division_queue','get',false), //killroy
	GetPlayerQueue: generic_resource(getPlayerQueueResource,'player_queue','get',false), //killroy
	GetEntry: generic_resource(getEntryResource,'entry','get',false),
	GetAllFinals: generic_resource(getAllFinalsResource,'finals','get', false),
	GetFinals: generic_resource(getFinalsResource,'final','get', false),        
	GetFinalsMatches: generic_resource(getFinalsMatchesResource,'finals_matches','get', false),
	GetFinalsMatch: generic_resource(getFinalsMatchResource,'finals_match','get', false),
	GetFinalsMatchSlots: generic_resource(getFinalsMatchSlotsResource,'finals_match_slots','get', false),
        GetHerbBestScores: generic_resource(getHerbBestScoresResource,'best_herb_results','get',false),        
	GetIfpaPlayer: generic_resource(getIfpaPlayerResource,'ifpa_player','get',false), //killroy
	GetPlayer: generic_resource(getPlayerResource,'player','get', false),//killroy
	GetPlayerActiveEntriesCount: generic_resource(getPlayerActiveEntriesCountResource,'player_active_entries_count','get', false), //killroy
	GetPlayerActiveEntry: generic_resource(getPlayerActiveEntryResource,'active_entry','get', false),
        GetPlayerPin: generic_resource(getPlayerPinResource,'player_pin','get',false),
        GetPlayersRankedByQualifying: generic_resource(getPlayersRankedByQualifyingResource,'ranked_players','get',false),
        GetPlayersRankedByQualifyingHerb: generic_resource(getPlayersRankedByQualifyingHerbResource,'ranked_players','get',false),
	GetPlayerTeams: generic_resource(getPlayerTeamsResource,'player_teams','get', false), //killroy
	GetPlayerTokens: generic_resource(getPlayerTokensResource,'player_tokens','get', false),//killroy
	GetPlayerTeamTokens: generic_resource(getPlayerTeamTokensResource,'player_team_tokens','get',false),
	GetSku: generic_resource(getSkuResource,'sku','get',false),        
	GetRoles: generic_resource(getRolesResource,'roles','get', false),
	GetTeam: generic_resource(getTeamResource,'team','get', false),
        GetTomConfig: generic_resource(getTomConfigResource,'tom_config','get', false),
	GetTeamActiveEntry: generic_resource(getTeamActiveEntryResource,'active_entry','get', false),
	GetTournament: generic_resource(getTournamentResource,'tournament','get',false), //killroy was here
	PlayerIsAsshole: generic_resource(playerIsAssholeResource,'empty','post', false), //killroy
        RemovePlayerQueue: generic_resource(removePlayerQueueResource,'empty','get', false),//enable        
        RemoveMachineFromDivision: generic_resource(removeMachineFromDivisionResource,'empty','get', false),//enable
        ResolveTieBreaker: generic_resource(resolveTieBreakerResource,'empty','post', false),//        
	SetDivisionMachinePlayer: generic_resource(setDivisionMachinePlayerResource,'division_machine','post', false), //killroy
	SetDivisionMachineTeam: generic_resource(setDivisionMachineTeamResource,'division_machine','post', false), //killroy
        SetFinalsMatch: generic_resource(setFinalsMatchResource,'poop_changed_finals_match','post', false),
        SetFinalsMatchInProgress: generic_resource(setFinalsMatchInProgressResource,'changed_finals_match','post', false),
        SetFinalsMatchResult: generic_resource(setFinalsMatchResultResource,'changed_match_result','post', false),
        SetFinalsMatchResultMachine: generic_resource(setFinalsMatchResultMachineResource,'changed_match_result','post', false),
	SetFinalsMatchScore: generic_resource(setFinalsMatchScoreResource,'changed_match_score','post', false),
	SetFinalsMatchSlots: generic_resource(setFinalsMatchSlotsResource,'changed_match_slot','post', false),

        //SetMatchScore: generic_resource(setMatchScoreResource,'match_score','post', false),
        SwipeTickets: generic_resource(swipeTicketsResource,'purchase_result','post', false),
        ToggleTournamentActive: generic_resource(toggleTournamentActiveResource,'toggled_tournament','post', false), //killroy was here
	UpdateDivisionMachine: generic_resource(updateDivisionMachineResource,'division_machine','post', false), //killroy
	UpdateDivision: generic_resource(updateDivisionResource,'empty','post', false), //killroy        
	VoidEntryToggle: generic_resource(voidEntryToggleResource,'entry','post', false), //killroy
	VoidEntry: generic_resource(voidEntryResource,'entry','post', false),
	VoidEntryBeforeCreate: generic_resource(voidEntryBeforeCreateResource,'entry','post', false),
	Login: generic_resource(loginResource,'logged_in_user','post', false),
	LoginPlayer: generic_resource(loginPlayerResource,'logged_in_player','post', false),
	FlushResourceCache:flush_resource_cache
    };
});
