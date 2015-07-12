"""Utility functions for routing"""
from functools import wraps

from werkzeug.exceptions import NotFound

def fetch_entity(model_class, arg_name):
    """Generate a wrapper to turn an id into a model object"""
    def wrap(decorated_f):
        """Generate a decorator to turn an id into a model object"""
        @wraps(decorated_f)
        def decorator(*args, **kwargs):
            """Decorator to turn an id into a model object"""
            kwargs[arg_name] = model_class.query.get(kwargs.pop(arg_name + '_id', None))
            if kwargs[arg_name] is None:
                raise NotFound('')
            return decorated_f(*args, **kwargs)
        return decorator
    return wrap
