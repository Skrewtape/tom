angular.module('tom_services.utils', []);
angular.module('tom_services.utils').factory('Utils', function($filter,StatusModal,TimeoutResources) {
    var get_metadivision_for_division = function(metadivisions,division_id){	
	for(metadivision_index in metadivisions){
	    metadivision = metadivisions[metadivision_index];
	    for(division_index in metadivision.divisions){
		if (division_index == division_id){
		    return metadivision;
		}
	    }
	}
	return undefined;
    }
    return {
	setEntryVoidStatus:function(void_state,entry){
	    StatusModal.loading()
	    if(void_state == true){
		void_state = "void"
	    } else {
		void_state = "active"
	    }
	    entry_promise = TimeoutResources.VoidEntryToggle(undefined,{entry_id:entry.entry_id,void_state:void_state});
	    entry_promise.then(function(data){
		StatusModal.loaded()
	    })	                
	    
	},
        remove_score:function(score){
            StatusModal.loading();
	    score.removed = true;
	    score_promise = TimeoutResources.DeleteScore(undefined,{score_id:score.score_id});
	    score_promise.then(function(data){
		StatusModal.loaded()
	    })	                
        },	
	change_score: function(score){
	    score.changed = undefined;
	    score_to_submit = {}
	    if(score.machine != undefined){
		score_to_submit.machine_id = score.machine.machine_id;		
	    } else {
		score_to_submit.machine_id = score.machine_id;
	    }
	    score_to_submit.score = score.score;
	    StatusModal.loading()
	    score_promise = TimeoutResources.ChangeScore(undefined,{score_id:score.score_id},score_to_submit);
	    score_promise.then(function(data){
		StatusModal.loaded()
	    })
        },
	score_and_machine_change:function(score){
            score.changed = 'dirty';
        },
	convertObjToArray: function(obj){
	    new_array = []
	    for(index in obj){
		obj_elem = obj[index];
		new_array.push(obj_elem);
	    }
	    return new_array;
	},
	truncateString: function(name,trunc_length){                        
	    
            if(name.length>trunc_length){
                return $filter('limitTo')(name,trunc_length)+'..';
            }
            return $filter('limitTo')(name,trunc_length);            
        },
	change_division_tickets: function(player_tokens,added_tokens,type,division_id,amount){
	    player_tokens[type][division_id]=player_tokens[type][division_id]+amount;
	    added_tokens[type][division_id]=added_tokens[type][division_id]+amount;
	},
	get_metadivision_for_division:get_metadivision_for_division,
	division_in_metadivision: function(metadivisions,division_id){
	    if(get_metadivision_for_division(metadivisions,division_id) == undefined){		
		return false
	    }	    
	    return true;
	},
	build_added_tokens: function(player_tokens,team_tokens,added_tokens){	    
	    for(id in player_tokens.metadivisions){
		added_tokens.metadivisions[id]=0;
	    }
	    for(id in player_tokens.divisions){
		added_tokens.divisions[id]=0;
	    }
	    for(id in team_tokens.teams){
		added_tokens.teams[id]=0;
	    }
	    
	},
	is_team_division: function(div_id,divisions,tournaments){
	    return tournaments[divisions[div_id].tournament_id].team_tournament
	}
    }
})
