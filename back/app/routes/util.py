"""Utility functions for routing"""
from functools import wraps

from werkzeug.exceptions import BadRequest

from flask_restless.helpers import to_dict

# def entry_dict(entry):    
#     #FIXME : need to use marshmellow here to make more generalized version
#     #http://marshmallow.readthedocs.org/en/latest/examples.html
#     entry_dict = to_dict(entry)
#     #entry_dict['player'] = to_dict(entry.player)
#     #entry_dict['machine'] = to_dict(entry.machine)
#     entry_dict['division'] = to_dict(entry.division)    
#     entry_dict['scores'] = []
#     for i in entry.scores:        
#         entry_dict['scores'].append(to_dict(i))
#     #entry_dict['scores'] = to_dict(entry.scores)
#     return entry_dict

# def player_dict(player):
#     player_dict = to_dict(player)
#     #print player_dict
#     player_dict['entries'] = []
#     for i in player.entries:
#         player_dict['entries'].append(entry_dict(i))
#     return player_dict


def fetch_entity(model_class, arg_name):
    """Generate a wrapper to turn an id into a model object"""
    def wrap(decorated_f):
        """Generate a decorator to turn an id into a model object"""
        @wraps(decorated_f)
        def decorator(*args, **kwargs):
            """Decorator to turn an id into a model object"""
            model_id = kwargs.pop(arg_name + '_id', None)
            kwargs[arg_name] = model_class.query.get(model_id)
            if kwargs[arg_name] is None:
                error_arg_list = (arg_name, model_class.__name__, model_class.__name__, model_id)
                raise BadRequest("Expecting url param %s_id with valid %s id but could not find valid %s with id %s" % error_arg_list)
            return decorated_f(*args, **kwargs)
        return decorator
    return wrap
