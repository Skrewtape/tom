from app import DB
from flask_restless.helpers import to_dict
from app.types import util, Team
from operator import itemgetter

FinalsMatch_FinalsPlayer_mapping = DB.Table(
    'finalsmatch_finalsplayer_mapping',
    DB.Column('finals_match_ex_id', DB.Integer, DB.ForeignKey('finals_match_ex.finals_match_ex_id')),
    DB.Column('finals_player_ex_id', DB.Integer, DB.ForeignKey('finals_player_ex.finals_player_ex_id'))
)


class FinalsEx(DB.Model):
    """Model object for a division finals"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    finals_ex_id = DB.Column(DB.Integer,primary_key=True)
    division_id = DB.Column(DB.Integer, DB.ForeignKey(
        'division.division_id'
    ))
    active = DB.Column(DB.Boolean)
    rounds = DB.Column(DB.Integer)
    num_players = DB.Column(DB.Integer)
    num_players_per_group = DB.Column(DB.Integer)
    num_games_per_match = DB.Column(DB.Integer)
    description = DB.Column(DB.String(100))
    finals_match_ex = DB.relationship('FinalsMatchEx')
 
    division = DB.relationship('Division')
   
    def to_dict_with_matches(self):
        finals_ex_dict = to_dict(self)
        finals_ex_dict['matches']=[]
        for finals_match_ex in self.finals_match_ex:
            finals_ex_dict['matches'].append(finals_match_ex.to_dict_complete())
        return finals_ex_dict
    
    def to_dict_simple(self):
        finals_ex_dict = to_dict(self)
        if self.description:
            finals_ex_dict['tournament_name'] = "%s %s" % (self.division.tournament.name,self.description)
        else:
            finals_ex_dict['tournament_name'] = "%s" % (self.division.tournament.name)
        if self.division.tournament.single_division is not True:
            finals_ex_dict['tournament_name'] = finals_ex_dict['tournament_name'] + self.division.name                    
        return finals_ex_dict

class FinalsMatchEx(DB.Model):
    """Model object for a division finals match"""    
    finals_match_ex_id = DB.Column(DB.Integer,primary_key=True)
    round_number = DB.Column(DB.Integer)
    finals_ex_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_ex.finals_ex_id'
    ))

    finals_match_slot_ex = DB.relationship('FinalsMatchSlotEx')
    
    bye_players = DB.relationship(
        'FinalsPlayerEx',
        secondary=FinalsMatch_FinalsPlayer_mapping
    )
    match_state = DB.Column(DB.String(25))
    
    finals_match_result_ex = DB.relationship('FinalsMatchResultEx')
        
    def to_dict_complete(self):
        finals_match_dict = to_dict(self)
        if self.bye_players:
            finals_match_dict['bye']=[]            
            for bye_player in self.bye_players:
                finals_match_dict['bye'].append(bye_player.to_dict_simple())

        finals_match_dict['slots']=[]

        for slot in self.finals_match_slot_ex:
            finals_match_dict['slots'].append(slot.to_dict_simple())
            
        finals_match_dict['results']=[]

        for finals_match_result_ex in self.finals_match_result_ex:
            finals_match_dict['results'].append(finals_match_result_ex.to_dict_with_scores())
            
        return finals_match_dict

    def to_dict_simple(self):
        finals_match_dict = to_dict(self)
        return finals_match_dict
    
class FinalsPlayerEx(DB.Model):
    finals_player_ex_id = DB.Column(DB.Integer,primary_key=True)    
    seed = DB.Column(DB.Integer)
    player_id = DB.Column(DB.Integer, DB.ForeignKey(
        'player.player_id'
    ))    
    final_rank = DB.Column(DB.Integer)
    player = DB.relationship('Player')

    def to_dict_simple(self):
        finals_player_ex_dict = to_dict(self)
        if self.player:
            finals_player_ex_dict['player_name']=self.player.first_name+" "+self.player.last_name
        return finals_player_ex_dict
    
class FinalsMatchSlotEx(DB.Model):
    """Model object for a division finals match"""    
    finals_match_slot_ex_id = DB.Column(DB.Integer,primary_key=True)
    finals_match_ex_id = DB.Column(DB.Integer,DB.ForeignKey(
        'finals_match_ex.finals_match_ex_id'
    ))
    finals_player_ex_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_player_ex.finals_player_ex_id'
    ))

    result = DB.Column(DB.String(25))
    final_rank = DB.Column(DB.Integer)
    tie_breaker = DB.Column(DB.Boolean, default=False)
    tie_breaker_result = DB.Column(DB.Boolean, default=False)
    
    finals_player_ex = DB.relationship('FinalsPlayerEx')
    
    def to_dict_simple(self):
        finals_slot_ex_dict = to_dict(self)
        if self.finals_player_ex:
            finals_slot_ex_dict['finals_player_ex'] = self.finals_player_ex.to_dict_simple()
        return finals_slot_ex_dict
    
class FinalsMatchResultEx(DB.Model):
    """Model object for a division finals match"""    
    finals_match_result_ex_id = DB.Column(DB.Integer,primary_key=True)
    game_number = DB.Column(DB.Integer)
    finals_machine_id = DB.Column(DB.Integer,DB.ForeignKey(
        'machine.machine_id'
    ))
    finals_match_ex_id = DB.Column(DB.Integer,DB.ForeignKey(
        'finals_match_ex.finals_match_ex_id'
    ))
    finals_match_result_score_ex = DB.relationship('FinalsMatchResultScoreEx')
    finals_machine = DB.relationship('Machine')
    result_state = DB.Column(DB.String(25))    
    
    def to_dict_with_scores(self):
        finals_match_result_ex_dict = to_dict(self)
        if self.finals_machine:
            finals_match_result_ex_dict['machine']=self.finals_machine.to_dict_simple()

        finals_match_result_ex_dict['scores']=[]
        for finals_match_result_score_ex in self.finals_match_result_score_ex:
            finals_match_result_ex_dict['scores'].append(finals_match_result_score_ex.to_dict_simple())
        return finals_match_result_ex_dict

class FinalsMatchResultScoreEx(DB.Model):
    """Model object for a division finals match"""    
    finals_match_result_score_ex_id = DB.Column(DB.Integer,primary_key=True)
    finals_match_result_ex_id = DB.Column(DB.Integer,
                                          DB.ForeignKey('finals_match_result_ex.finals_match_result_ex_id')
    )
    finals_player_ex_id = DB.Column(DB.Integer, DB.ForeignKey(
        'finals_player_ex.finals_player_ex_id'
    ))
    score = DB.Column(DB.Integer)
    rank = DB.Column(DB.Integer)
    order = DB.Column(DB.Integer)
    
    finals_player_ex = DB.relationship('FinalsPlayerEx')
    
    def to_dict_simple(self):
        return to_dict(self)

    
# class FinalsScore(DB.Model):
#     match_id = DB.Column(DB.Integer, DB.ForeignKey(
#         'finals_match.match_id'
#     ))    
#     finals_player_score_id = DB.Column(DB.Integer,primary_key=True)    
#     finals_player_id = DB.Column(DB.Integer, DB.ForeignKey(
#         'finals_player.finals_player_id'
#     ))    
#     score = DB.Column(DB.BIGINT)    
#     game_number = DB.Column(DB.Integer)
#     division_machine_id = DB.Column(DB.Integer, DB.ForeignKey(
#         'division_machine.division_machine_id'
#     ))

#     def to_dict_simple(self):
#         return to_dict(self)        
