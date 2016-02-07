"""Model object for a player"""

from app import DB
from flask_restless.helpers import to_dict

Player_Division_mapping = DB.Table(
    'player_division',
    DB.Column('player_id', DB.Integer, DB.ForeignKey('player.player_id')),
    DB.Column('division_id', DB.Integer, DB.ForeignKey('division.division_id'))
)

class Player(DB.Model):
    """Model object for a player"""
    # pylint: disable=no-init
    # pylint can't find SQLAlchemy's __init__() method for some reason
    player_id = DB.Column(DB.Integer,primary_key=True)
    first_name = DB.Column(DB.String(1000))
    last_name = DB.Column(DB.String(1000))
    search_name = DB.Column(DB.String(1000))
    linked_division = DB.relationship(
        'Division',
        secondary=Player_Division_mapping        
    )
    
    machine_id = DB.Column(DB.Integer, DB.ForeignKey(
        'machine.machine_id'
    ))

    machine = DB.relationship(
        'Machine',
        backref=DB.backref('player'),
        foreign_keys=[machine_id]        
    )

    # active_tournaments_entries = DB.relationship(
    #     'Entry',
    #     secondary="join(Entry,Division,Entry.division_id==Division.division_id)",        
    #     primaryjoin="Player.player_id==Entry.player_id",                
    #     secondaryjoin="and_(Division.division_id==Entry.division_id,"
    #     "and_(Division.tournament_id==Tournament.tournament_id,"
    #     "Tournament.active==True))"
    # )

    active_tournaments_entries_completed_and_voided = DB.relationship(
        'Entry',
        secondary="join(Entry,Division,Entry.division_id==Division.division_id)",        
        primaryjoin="Player.player_id==Entry.player_id",                
        secondaryjoin="and_(Division.division_id==Entry.division_id,"
        "and_(Division.tournament_id==Tournament.tournament_id,"
        "and_(Tournament.active==True,Entry.completed==True)))"
    )

    active_tournaments_active_entry = DB.relationship(
        'Entry',
        secondary="join(Entry,Division,Entry.division_id==Division.division_id)",        
        primaryjoin="Player.player_id==Entry.player_id",                
        secondaryjoin="and_(Division.division_id==Entry.division_id,"
        "and_(Division.tournament_id==Tournament.tournament_id,"
        "and_(Tournament.active==True,"
        "and_(Entry.completed==False,Entry.voided==False))))"
    )
    
    
    def build_tournament_entries_dict(self,type='active_tournaments_active_entry'):
        tournament_entries_dict={'tournaments':{}}
        if type == 'active_tournaments_entries_completed_and_voided':        
            entries = self.active_tournaments_entries_completed_and_voided
        elif type == 'active_tournaments_active_entry':
            entries = self.active_tournaments_active_entry            
        else :
            raise Exception('bad argument given!')
        
        for entry in entries:
            init_tournament_entries_dict_for_entry(entry,tournament_entries_dict)
            ##tournament_entries_dict['tournaments'][tournament_id]['divisions'][division_id].append(entry.to_dict_with_relationships())
        return tournament_entries_dict

    def init_tournament_entries_dict_for_entry(self, entry, tournament_entries_dict):
        tournament_id = entry.division.tournament_id
        division_id = entry.division_id
        if entry.division.tournament_id not in tournament_entries_dict['tournaments']:                
            tournament_entries_dict['tournaments'][tournament_id]={'divisions':{}}                
        if entry.division.division_id not in tournament_entries_dict['tournaments'][tournament_id]['divisions']:
            tournament_entries_dict['tournaments'][tournament_id]['divisions'][division_id]=[]            
        
    def to_dict_simple(self):
        return to_dict(self)        

    def to_dict_with_relationships(self, relationship):
        player = to_dict(self)        
        if self.machine:
            player['machine'] = self.machine.to_dict()
        if self.linked_division:            
            ##player['linked_division'] = self.linked_division[0].to_dict()
            pass
        player['entries']=self.build_tournament_entries_dict(type, relationship)
        
    def to_dict(self, type='simple'):
        player = to_dict(self)
        if(type == 'simple'):
            return player        
        machine = self.machine
        linked_division = self.linked_division
        #entries = self.entries
                
        if machine:
            player['machine'] = machine.to_dict()
        if linked_division:
            player['linked_division'] = linked_division[0].to_dict()
        player['entries']=self.build_tournament_entries_dict(type)
        return player
    
