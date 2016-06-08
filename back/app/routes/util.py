"""Utility functions for routing"""
from functools import wraps

from werkzeug.exceptions import BadRequest, ImATeapot

from flask_restless.helpers import to_dict
from app.types import Division, Tournament

def i_am_a_teapot(message,goto_state): #killroy
    #FIXME : goto_state should be handled on the client side, but I'm being lazy
    new_exception = ImATeapot(message)
    new_exception.state_go = goto_state
    return new_exception

def get_division_from_metadivision(metadiv_id): #killroy
    # WE ASSUME ONLY ONE DIVISION IN A METADIVISION IS ACTIVE AT ONCE
    return Division.query.filter_by(metadivision_id=metadiv_id).join(Tournament).filter_by(active=True).first()

#FIXME : this should not be needed anymore
def calculate_score_points_from_rank(rank):
    if rank == 0:
        return 0
    if rank == 1:
        return 100
    if rank == 2:
        return 90    
    if rank > 87:
        return 0
    return 88-rank
    
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
