angular.module('tom_services.utils', []);
angular.module('tom_services.utils').factory('Utils', function() {
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
	change_division_tickets: function(player_tokens,added_tokens,type,division_id,amount){
	    console.log('in it');
	    console.log(added_tokens);
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
	build_added_tokens: function(player_tokens,added_tokens){	    
	    for(id in player_tokens.metadivisions){
		added_tokens.metadivisions[id]=0;
	    }
	    for(id in player_tokens.divisions){
		added_tokens.divisions[id]=0;
	    }
	}
    }
})
