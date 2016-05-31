from app import DB
from flask_restless.helpers import to_dict
from app.types import util, Team
from operator import itemgetter

class Finals(DB.Model):
    """Model object for a division finals"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    finals_id = DB.Column(DB.Integer,primary_key=True)
    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))
    active = DB.Column(DB.Boolean)
    rounds = DB.Column(DB.Integer)
    #FIXME : division_machines should link to match?  score?
    division_machines = DB.relationship(
        'DivisionMachine',
        lazy='joined'
    )
    def to_dict_simple(self):
        return to_dict(self)        
    
        
class FinalsMatch(DB.Model):
    """Model object for a division finals match"""    
    match_id = DB.Column(DB.Integer,primary_key=True)
    round_id = DB.Column(DB.Integer)
    finals_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals.finals_id'
    ))
    match_with_byes = DB.Column(DB.Boolean)
    parent_id = DB.Column(DB.Integer)

    finals_players = DB.relationship(
        'FinalsPlayer',
        lazy='joined'
    )    
    
    def to_dict_simple(self):
        finals_match_dict = to_dict(self)
        finals_match_dict['finals_players']={}
        for finals_player in self.finals_players:
            finals_player_dict = finals_player.to_dict_simple()
            finals_match_dict['finals_players'][finals_player_dict['finals_player_id']]=finals_player_dict
        finals_match_regrouped_dict = to_dict(self)
        finals_match_dict['games']={}
        finals_match_dict['games'][0]=[]
        finals_match_dict['games'][1]=[]
        finals_match_dict['games'][2]=[]        
        for (finals_player_id,player) in finals_match_dict['finals_players'].iteritems():
            for score in player['scores']:
                finals_match_dict['games'][score['game_number']].append(score)
        for game_number in range(3):
            finals_match_dict['games'][game_number] = sorted(finals_match_dict['games'][game_number], key=itemgetter('score'), reverse=True)                
        for game_number in range(3):
            points = 3
            for score in finals_match_dict['games'][game_number]:
                score['points'] = points
                points = points - 1
        player_ranks={}
        sorted_player_ranks={}
        for game_number in range(3):
            for score in finals_match_dict['games'][game_number]:
                if not player_ranks.has_key(score['finals_player_id']):
                    player_ranks[score['finals_player_id']]=0
                player_ranks[score['finals_player_id']]=player_ranks[score['finals_player_id']]+score['points']
        num_player_advanced=1
        for key, value in sorted(player_ranks.iteritems(), key=lambda (k,v): (v,k), reverse=True):
            if num_player_advanced < 3:
                sorted_player_ranks[key]="Advancing"
                num_player_advanced=num_player_advanced+1
            else:
                sorted_player_ranks[key]="%d" %  player_ranks[key]                
        finals_match_dict['player_ranks']=sorted_player_ranks                
        return finals_match_dict
    
class FinalsPlayer(DB.Model):
    """Model object for a division finals players score"""        
    finals_player_id = DB.Column(DB.Integer,primary_key=True)
    match_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_match.match_id'
    ))    
    player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'player.player_id'
    ))
    finals_seed = DB.Column(DB.Integer)

    player = DB.relationship(
        'Player',
        lazy='joined'
    )
    
    finals_scores = DB.relationship(
        'FinalsScore',
        lazy='joined'
    )

    def to_dict_simple(self):
        finals_player_dict = to_dict(self)
        finals_player_dict['scores'] = []
        for finals_score in self.finals_scores:
            finals_player_dict['scores'].append(finals_score.to_dict_simple())
        games_played = 0
        total_score = 0
        for score in finals_player_dict['scores']:
            if score['score']:
                games_played = games_played + 1
                #total_score = total_score + score['points']
        finals_player_dict['games_played'] = games_played
        if self.player:
            finals_player_dict['player_name'] = "%s %s" % (self.player.first_name,self.player.last_name)
        else:
            pass
        return finals_player_dict

class FinalsScore(DB.Model):
    match_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_match.match_id'
    ))    
    finals_player_score_id = DB.Column(DB.Integer,primary_key=True)    
    finals_player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_player.finals_player_id'
    ))    
    score = DB.Column(DB.BIGINT)    
    game_number = DB.Column(DB.Integer)
    division_machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division_machine.division_machine_id'
    ))

    def to_dict_simple(self):
        return to_dict(self)        
